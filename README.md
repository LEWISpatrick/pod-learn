# PodLearn

PodLearn is a Next.js application that uses AI to analyze podcasts, extract key information, and create personalized learning materials.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Git
- A Neon database account

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/your-username/pod-learn.git
   cd pod-learn
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

3. Set up your Neon database:

   - Sign up for a Neon account at https://neon.tech
   - Create a new project
   - In your project dashboard, find your connection string

4. Set up environment variables:

   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     DATABASE_URL="your-neon-connection-string"
     NEXTAUTH_SECRET="your-nextauth-secret"
     NEXTAUTH_URL="http://localhost:3000"
     OPENAI_API_KEY="your-openai-api-key"
     ELEVENLABS_API_KEY="your-elevenlabs-api-key"
     ```

5. Set up the database schema:

   ```
   npx prisma db push
   ```

6. Run the development server:

   ```
   npm run dev
   ```

   or

   ```
   yarn dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Create custom podcasts on any topic
- Save and manage your podcasts
- Interactive grid background
- Authentication system

## Technologies Used

- Next.js
- React
- Prisma
- NextAuth.js
- OpenAI API
- ElevenLabs API
- Tailwind CSS
- Material-UI

## Project Structure

- `app/`: Contains the main application code
- `components/`: Reusable React components
- `lib/`: Utility functions and configurations
- `prisma/`: Database schema and migrations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
