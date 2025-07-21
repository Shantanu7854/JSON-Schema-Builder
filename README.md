### JSON Schema Builder

Deployed Link: [json-schema-builder-kzx1.vercel.app/](json-schema-builder-kzx1.vercel.app/) 

---

### Features

* Add/edit/delete fields
* Support for **nested schemas**
* Live **JSON preview**
* Built with **React Hook Form**, **ShadCN**, and **Tailwind**
* Lightning-fast development with **Vite + TypeScript**

---

### Tech Stack

| Technology      | Purpose                 |
| --------------- | ----------------------- |
| React           | UI Framework            |
| TypeScript      | Type safety             |
| Vite            | Build tool              |
| Tailwind CSS    | Styling                 |
| ShadCN UI       | Beautiful UI components |
| React Hook Form | Form state management   |
| UUID            | Unique key generation   |

---

### Getting Started

```bash
# 1. Clone the project
git clone https://github.com/Shantanu7854/JSON-Schema-Builder
cd json-schema-builder

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Now visit [http://localhost:5173](http://localhost:5173) in your browser.

---

### Project Structure

```
src/
│
├── components/
│   ├── FieldRow.tsx
│   ├── JsonPreview.tsx
│   └── SchemaBuilder.tsx
│
├── types/
│   └── schema.d.ts
│
├── ui/ (ShadCN components)
│
├── App.tsx
└── main.tsx
```

---

### Scripts

```bash
npm run dev       # Start development server
npm run build     # Build production app
npm run preview   # Preview production build
```

---

### Example Output

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "profile": {
    "bio": "Frontend dev",
    "age": 27
  }
}
```

---


