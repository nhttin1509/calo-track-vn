'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface Entry {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    micronutrients: string; // JSON string
    date: string;
}

export interface UserProfile {
    height: number;
    weight: number;
    age: number;
    gender: string;
    activity_level: string;
    body_fat?: number;
    tdee: number;
}

export async function addEntry(formData: FormData) {
    const name = formData.get('name') as string;
    const calories = Number(formData.get('calories'));
    const protein = Number(formData.get('protein')) || 0;
    const carbs = Number(formData.get('carbs')) || 0;
    const fat = Number(formData.get('fat')) || 0;
    const micronutrients = formData.get('micronutrients') as string || '{}';
    const date = new Date().toISOString().split('T')[0];

    if (!name || !calories) return;

    await db.execute({
        sql: 'INSERT INTO entries (name, calories, protein, carbs, fat, micronutrients, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [name, calories, protein, carbs, fat, micronutrients, date]
    });

    revalidatePath('/');
}

export async function deleteEntry(id: number) {
    await db.execute({
        sql: 'DELETE FROM entries WHERE id = ?',
        args: [id]
    });

    revalidatePath('/');
}

export async function getEntries() {
    const date = new Date().toISOString().split('T')[0];
    const result = await db.execute({
        sql: 'SELECT * FROM entries WHERE date = ? ORDER BY id DESC',
        args: [date]
    });

    // Map Row to Entry because LibSQL returns { rows: [], columns: [] } or similar structure depending on HTTP/Local
    // @libsql/client result.rows is an array of objects (if fields are named) or values.
    // Actually, createClient defaults to objects if using the standard client.
    return result.rows as unknown as Entry[];
}

export async function saveUserProfile(profile: UserProfile) {
    // Note: parameters like @height are supported if using named args, but simpler to use positional ? or :name
    // LibSQL client supports named args with :name or $name but usage varies. Safer to use positional or ensure object mapping.
    // For simplicity, I'll use standard SQL with positional arguments to avoid named-arg quirks in different adapters.

    await db.execute({
        sql: `
        INSERT INTO user_profile (id, height, weight, age, gender, activity_level, body_fat, tdee)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
        height=excluded.height, weight=excluded.weight, age=excluded.age, gender=excluded.gender, activity_level=excluded.activity_level, body_fat=excluded.body_fat, tdee=excluded.tdee, updated_at=CURRENT_TIMESTAMP
        `,
        args: [
            profile.height,
            profile.weight,
            profile.age,
            profile.gender,
            profile.activity_level,
            profile.body_fat || null,
            profile.tdee
        ]
    });

    revalidatePath('/');
}

export async function getUserProfile(): Promise<UserProfile | undefined> {
    const result = await db.execute('SELECT * FROM user_profile WHERE id = 1');
    return result.rows[0] as unknown as UserProfile | undefined;
}
