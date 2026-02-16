"use client";

import { useState } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

export default function Login() {
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(state);
  }

  return (
    <div className="max-w-md m-auto">
      <h1 className="text-foreground text-center text-2xl my-8">
        Login to hachimi.tv
      </h1>
      <Form onSubmit={onSubmit}>
        <Input
          label="Email"
          labelPlacement="outside"
          placeholder="Enter your email"
          type="email"
          value={state.email}
          onChange={(e) => setState({ ...state, email: e.target.value })}
          isRequired
        />
        <Input
          label="Password"
          labelPlacement="outside"
          placeholder="Enter your password"
          type="password"
          value={state.password}
          onChange={(e) => setState({ ...state, password: e.target.value })}
          isRequired
        />
        <Button type="submit" className="w-full mt-4">
          Login
        </Button>
      </Form>
    </div>
  );
}
