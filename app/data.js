const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

const users = [
    {
        id: 'c2481a7d-10ce-4612-970f-08483791ad95',
        name: 'Alan Kronberger',
        username: 'Foxo',
        email: 'foxothefool@gmail.com',
        profile_pic_url: '/post_pics/crab.jpg',
        password: 'Password123!',
        joined: '2022-01-01 00:00:00',
        last_active: '2023-12-31 00:00:00',
    },
    {
        id: '045a48db-db0a-42d1-9ccb-b0fbe660325e',
        name: 'Leaf Erikson',
        username: 'rockawaybeach2629',
        email: 'lerikson@raiders.com',
        profile_pic_url: '/post_pics/jumping-spider.jpg',
        password: 'Password123!',
        joined: '2022-04-05 09:15:08',
        last_active: '2023-12-31 00:00:00',
    }
];

const posts = [
    {
        id: '38de5ee4-a606-4c9a-b852-ff11ca03c4df',
        user_id: 'c2481a7d-10ce-4612-970f-08483791ad95',
        image_url: '/post_pics/Bun.jpg',
        created_at: '2024-05-01 15:00:00',
    },
    {
        id: 'fea66482-65a5-4095-896b-6262202d0fa2',
        user_id: 'c2481a7d-10ce-4612-970f-08483791ad95',
        image_url: '/post_pics/Pepper.jpg',
        created_at: '2024-05-01 15:00:00',
    },
    {
        id: '89328921-9f6f-47cf-aa9a-a0ce739624e9',
        user_id: 'c2481a7d-10ce-4612-970f-08483791ad95',
        image_url: '/post_pics/Drake.jpg',
        created_at: '2024-05-01 15:00:00',
    },
    {
        id: '8ec2ca13-fb3d-4cc7-800e-3bb00c30192b',
        user_id: 'c2481a7d-10ce-4612-970f-08483791ad95',
        image_url: '/post_pics/Dior.jpg',
        created_at: '2024-05-01 15:00:00',
    },
    {
        id: '7fd40f58-b9d7-4890-a48d-7744aa3b1a03',
        user_id: 'c2481a7d-10ce-4612-970f-08483791ad95',
        image_url: '/post_pics/Bean.jpg',
        created_at: '2024-05-01 15:00:00',
    },
    {
        id: '317d1c48-7b32-49bd-ac09-f6e4f9eb6bcc',
        user_id: 'c2481a7d-10ce-4612-970f-08483791ad95',
        image_url: '/post_pics/Sparrow.jpg',
        created_at: '2024-05-01 15:00:00',
    },
    {
        id: '3ac6d263-6c61-4606-b8c3-d9c5330fbf11',
        user_id: '045a48db-db0a-42d1-9ccb-b0fbe660325e',
        image_url: '/post_pics/Bird.jpg',
        created_at: '2024-05045a48db-db0a-42d1-9ccb-b0fbe660325ef66-ae2f-71fdc791ceb8',
    },
    {
        id: 'ded98b8f-2376-4f5f-829b-8a4557ed969c',
        user_id: '045a48db-db0a-42d1-9ccb-b0fbe660325e',
        image_url: '/post_pics/g.jpg',
        created_at: '2024-05-01 15:00:00',
    },
];

const follows = [
    {
        followee_id: '045a48db-db0a-42d1-9ccb-b0fbe660325e',
        follower_id: 'c2481a7d-10ce-4612-970f-08483791ad95',
        followed_at: '2023-09-18 12:00:00',
    },
];

async function seedUsers(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        profile_pic_url VARCHAR(255) NOT NULL,
        password TEXT NOT NULL,
        joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        console.log("Users created");

        const insertUsers = await Promise.all(
            users.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return client.sql`
                INSERT INTO users (id, name, username, email, profile_pic_url, password, joined, last_active)
                VALUES (${user.id}, ${user.name}, ${user.username}, ${user.email},
                    ${user.profile_pic_url}, ${hashedPassword}, ${user.joined}, ${user.last_active})
                    ON CONFLICT (id) DO NOTHING;`;
            }),
        );

        console.log(`Seeded ${insertUsers.length} users`);

        return{
            createTable,
            users: insertUsers,
        };
    } catch(error) {
        console.error('Error seeding users:', error);
        throw error;
    }
}

async function seedPosts(client) {
    try{
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS posts (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            image_url VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        console.log("Posts created");

        const insertedPosts = await Promise.all(
            posts.map(async (post) => {
                client.sql`
                INSERT INTO posts (id, user_id, image_url, created_at)
                VALUES (${post.id}, ${post.user_id}, ${post.image_url}, ${post.created_at})`
            }),
        );

        console.log("Seeded posts");

        return {
            createTable,
            posts: insertedPosts,
        };
    } catch (error) {
        console.error('Error seeding posts:', error);
        throw error;
    }
}

async function seedFollow(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS follows (
            followee_id UUID NOT NULL,
            follower_id UUID NOT NULL,
            followed_at TIMESTAMP DEFUALT CURRENT_TIMESTAMP,
            PRIMARY KEY (followee_id, follower_id)
        );`;

        console.log("Follows created");

        const insertedFollows = await Promise.all(
            follows.map(async (follow) => client.sql`
            INSERT INTO follows (followee_id, follwer_id, followed_at)
            VALUES (${follow.followee_id}, ${follow.follower_id}, ${follow.followed_at})`),
        );

        console.log("Seeded follows");

        return {
            createTable,
            follows: insertedFollows,
        };
    } catch (error) {
        console.error("Error seeding follows", error);
        throw error;
    }
}