import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
        <h1 className="font-black text-center text-4xl text-black">Página no encontrada</h1>
        <p className="mt-10 text-center text-black">
            Tal ves quieras volver a {' '}
            <Link className="text-teal-500" to={'/'}>Proyectos</Link>
        </p>
    </>
  )
}
