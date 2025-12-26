import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    // Ensure we don't proceed without admin privileges
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const examples = [
    {
        id: crypto.randomUUID(),
        name: 'Code Reviewer',
        description: 'Analyzes code for bugs, security issues, and style improvements.',
        category: 'Engineering',
        tags: ['code', 'review', 'security'],
        triggers: ['Review this code', 'Check for bugs'],
        instructions: `You are an expert Senior Software Engineer and Code Reviewer. 
Your goal is to analyze the provided code snippets for:
1. Logic Errors and Bugs
2. Security Vulnerabilities (OWASP Top 10)
3. Performance Bottlenecks
4. Code Style and Readability (Clean Code principles)

Provide your feedback in a structured format with priority levels (Critical, High, Medium, Low). Include refactoring suggestions with code blocks.`,
        // sample_output removed
    },
    {
        id: crypto.randomUUID(),
        name: 'Technical Writer',
        description: 'Transforms technical concepts into clear, accessible documentation.',
        category: 'Product',
        tags: ['documentation', 'writing', 'technical'],
        triggers: ['Write documentation', 'Explain this concept'],
        instructions: `You are an expert Technical Writer. 
Your goal is to explain complex technical concepts to a specific audience (default: developers, but adapt if requested).
- Use clear, concise language.
- Structure content with headings, bullet points, and code examples.
- Focus on the "Why" and "How".
- Avoid jargon where possible, or define it immediately.`,
        // sample_output removed
    },
    {
        id: crypto.randomUUID(),
        name: 'Data Analyst',
        description: 'Extracts insights and patterns from raw data sets.',
        category: 'Data',
        tags: ['analysis', 'data', 'insights'],
        triggers: ['Analyze this data', 'Find trends'],
        instructions: `You are a Data Analyst with expertise in statistics and business intelligence.
Given a dataset (CSV, JSON, or text description):
1. Identify key trends and patterns.
2. Calculate summary statistics (mean, median, etc.).
3. Highlight outliers or anomalies.
4. Suggest potential business actions based on the data.`,
        // sample_output removed
    }
];

async function seed() {
    console.log('Connecting to Supabase...');
    console.log(`URL: ${supabaseUrl}`);

    for (const example of examples) {
        // Check if exists
        const { data } = await supabase
            .from('templates')
            .select('id')
            .eq('name', example.name)
            .single();

        if (!data) {
            const { error: insertError } = await supabase
                .from('templates')
                .insert(example);

            if (insertError) {
                console.error(`Failed to insert ${example.name}:`, insertError);
            } else {
                console.log(`✅ Inserted ${example.name}`);
            }
        } else {
            console.log(`ℹ️ Skipping ${example.name} (Already exists)`);
        }
    }
    console.log('Seed initialization complete.');
}

seed().catch(console.error);
