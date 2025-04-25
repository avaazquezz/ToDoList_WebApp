import '../styles/HomePage.css';
import NavBar from '../components/NavBar'

const HomePage = () => {
  return (
    <div>
      <NavBar />

      <div className="home-page">
        <h2>Bienvenido a los mandos de control</h2>
        <p>Desde aqui vas a podoer crear diferentes proyectos y asi, poder manejar todos tus frentes abiertos efectivamente. </p>
      </div>



    </div>
  );
};

export default HomePage;