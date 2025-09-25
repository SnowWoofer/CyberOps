import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

useEffect(() => {
  const q = query(collection(db, "checkins"), orderBy("createdAt", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    setCheckins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
  return () => unsubscribe();
}, []);

function App() {
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [checkins, setCheckins] = useState([]);

  // Subscribe to Firestore updates
  useEffect(() => {
    const q = query(collection(db, "participants"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setParticipants(list);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addDoc(collection(db, "participants"), {
      name,
      createdAt: new Date(),
    });
    setName(""); // reset input
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Hackathon Check-in</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter participant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <button type="submit">Add</button>
      </form>

      {/* List */}
      <h2>Participants</h2>
      <ul>
        {participants.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
