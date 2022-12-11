import Head from "next/head";
import { useEffect } from "react";
import Editor from "../modules/rete/editor";
import { useState } from "react";

const Home = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then(console.log);
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Rete.js - Next App</title>
        <meta name="description" content="A starter for your rete.js app with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {mounted && (
        <div style={{ textAlign: "left", width: "100vw", height: "100vh" }}>
          <div ref={(el) => Editor(el)} />
        </div>
      )}
    </>
  );
};

export default Home;
