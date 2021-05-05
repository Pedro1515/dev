import React from "react";
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  Select,
  FormControl,
  FormSection,
  FormInput,
} from "src/components";

export default function Create() {
  return (
    <Layout>
      <LayoutHeader>
        <span className="font-medium text-lg">Crear Username</span>
      </LayoutHeader>
      <LayoutContent>
        <div className="p-6">
          <FormSection title="Perfil" subtitle="Datos personales del Username">
            <FormControl
              label="Username"
              component={
                <FormInput
                  id="Name de Username"
                  type="text"
                  placeholder="Ingrese Name de Username"
                />
              }
            />
            <FormControl
              label="Name"
              component={
                <FormInput
                  id="username"
                  type="text"
                  placeholder="Ingrese Name"
                />
              }
            />
            <FormControl
              label="Apellido"
              component={
                <FormInput
                  id="username"
                  type="text"
                  placeholder="Ingrese apellido"
                />
              }
            />
            <FormControl
              label="Nacionalidad"
              component={
                <Select
                  name="nationality"
                  options={[
                    { label: "Argentina", value: "ar" },
                    { label: "Brasil", value: "br" },
                  ]}
                  selected={{ label: "Argentina", value: "ar" }}
                  onSelect={(e) => console.log(e)}
                />
              }
            />
          </FormSection>
        </div>
      </LayoutContent>
    </Layout>
  );
}
