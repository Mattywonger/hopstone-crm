import { Button } from "./ui/button"; 
import { Link } from 'react-router-dom';
import Header from "./header";
import { Firebase } from "../providers/user"; 

export const Home = () => {
  const { user } = Firebase.useContainer(); 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header />
      {user && ( 
        <div className="top-right-button">
          <Link to="/add-new-deal">
            <Button style={{
              backgroundColor: '#3391CC',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: 'none',
              textDecoration: 'none',
            }}>+ Add New</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
