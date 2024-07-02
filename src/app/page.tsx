export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="mb-16">
        <h1 className="text-6xl text-white mb-10">
          Projeto de nivelamento técnico
        </h1>
        <h2 className="text-center text-2xl text-white">
          Projeto Integrador - UNIVESP
        </h2>
      </div>

      <p className="text-white">
        Comece sua primeira página criando uma pasta (com o nome da página)
        dentro de <code className="border p-1">src\app</code>.
      </p>
      <p className="text-white">
        Dentro desta pasta, crie um arquivo{" "}
        <code className="border p-1">page.tsx</code>.
      </p>

      <h3 className="mt-20 text-4xl text-white">Boa sorte!</h3>
    </main>
  );
}
