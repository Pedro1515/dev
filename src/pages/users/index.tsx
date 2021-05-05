import { Layout, LayoutHeader, LayoutContent, Button } from "src/components";
import { useRouter } from "next/router";

export default function Users() {
  const router = useRouter();

  const goToCreate = () => router.push("/users/create");

  return (
    <Layout>
      <LayoutHeader>
        <span className="font-medium text-lg">Usernames</span>
        <div>
          <Button
            label="Crear Username"
            variant="primary"
            color="indigo"
            onClick={goToCreate}
          />
        </div>
      </LayoutHeader>
      <LayoutContent>Contenido...</LayoutContent>
    </Layout>
  );
}
