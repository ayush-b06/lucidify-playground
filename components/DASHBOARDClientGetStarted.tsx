import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { db } from '../firebaseConfig'; // Firestore instance
import DashboardClientSideNav from './DashboardClientSideNav';
import DashboardTopBar from './DashboardTopBar';

interface Project {
  name: string;
  progress: number;
  // Add other fields as needed, e.g., description, deadlines, etc.
}

const DASHBOARDClientGetStarted = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [firstName, setFirstName] = useState<String | null>(null);
  const auth = getAuth();
  const router = useRouter();

  // Function to get the formatted date
  const getFormattedDate = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const currentDate = new Date();
    const day = days[currentDate.getDay()];
    const date = currentDate.getDate();
    const month = months[currentDate.getMonth()];

    return `${day}, ${month} ${date}`;
  };


  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (!user) {
        // Redirect to login page if user is not authenticated
        router.push('/login');
        return;
      }

      try {
        // Get the user document from the "users" collection
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstName(data.firstName);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [auth, router]);

  return (
    <div className="flex flex-col xl:flex-row h-screen DashboardBackgroundGradient overflow-hidden">
      {/* Left Sidebar */}
      <DashboardClientSideNav highlight="getStarted" />

      {/* Right Side (Main Content) */}
      <div className="flex-1 flex flex-col pt-[60px] xl:pt-0"> {/* Takes up remaining space */}
        <DashboardTopBar title="Get Started" />


        <div className="flex w-full justify-center">
          <div className="flex flex-col relative w-full mx-[50px] my-[30px]">
            <div className="flex flex-col">
              <h1 className="text-[30px] font-semibold mb-[2px]">Welcome, {firstName || "user..."}!</h1>
              <h3 className="text-[14px] font-light opacity-60">Today is {getFormattedDate()}</h3>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

};

export default DASHBOARDClientGetStarted;
