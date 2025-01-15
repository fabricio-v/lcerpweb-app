import ButtonSignout from "./components/ButtonSignout";

export default async function Dashboard() {
  return (
    <div className="bg-sunsetskyLight">
      <p>dashboard</p>

      <ButtonSignout />

      {/* <Button
        onClick={() => {
          signOut();
        }}
      >
        Logout
      </Button> */}
    </div>
  );
}
