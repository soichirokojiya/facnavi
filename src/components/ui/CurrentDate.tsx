"use client";

import { useState, useEffect } from "react";

export function CurrentDate() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const now = new Date();
    setDate(`${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`);
  }, []);

  return <>{date}</>;
}
