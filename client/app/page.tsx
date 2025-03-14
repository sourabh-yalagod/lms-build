import NonDashboardNavbar from "@/components/NonDashboardNavBar";
import Landing from "./(nodashboard)/landing/page";

const Home = () => {
  return (
    <div className="nondashboard-layout">
      <NonDashboardNavbar/>
      <main className="nondashboard-layout__main">
        <Landing/>
      </main>
    </div>
  );
};
export default Home;
