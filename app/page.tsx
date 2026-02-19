"use client";

import { FormEvent, useMemo, useState } from "react";

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const remainingCount = useMemo(
    () => todos.filter((todo) => !todo.done).length,
    [todos],
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    setTodos((prev) => [
      {
        id: Date.now(),
        text: trimmed,
        done: false,
      },
      ...prev,
    ]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  };

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Todo</h1>
      <p className="mt-2 text-sm text-zinc-600">남은 할 일: {remainingCount}</p>

      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="할 일을 입력하세요"
          className="h-11 flex-1 rounded-md border border-zinc-300 px-3 outline-none focus:border-zinc-500"
        />
        <button
          type="submit"
          className="h-11 rounded-md bg-black px-4 font-medium text-white hover:bg-zinc-800"
        >
          추가
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2"
          >
            <label className="flex min-w-0 flex-1 items-center gap-3">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span
                className={`truncate ${todo.done ? "text-zinc-400 line-through" : "text-zinc-800"}`}
              >
                {todo.text}
              </span>
            </label>
            <button
              type="button"
              onClick={() => removeTodo(todo.id)}
              className="ml-3 rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

