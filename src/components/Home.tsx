import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import Header from './header';
import KanbanBoard from './kanban';
import { Firebase } from '../providers/user';

export const Home = () => {

  const { user } = Firebase.useContainer();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header />
      <div className="mt-16"> 
        {user && (
          <div className="top-right-button">
            <Link to="/add-new-deal">
              <Button style={{
                backgroundColor: '#3391CC',
                color: 'white',
                border: 'none',
                padding: '8px 30px', 
                maxWidth: '55px', 
                maxHeight: '20px',
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
        <KanbanBoard />
      </div>
    </div>
  );
};

export default Home;
