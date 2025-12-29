export const breadcrumb = {
  dashboard: { label: "Dashboard", path: "/dashboard" },
  reports: { label: "Reportes", path: "/reports" },
  users: { label: "Usuarios", path: "/users" },
  user: (userId: string, userName: string) => ({ label: userName, path: `/users/${userId}` }),
  clients: { label: "Clientes", path: "/clients" },
  client: (clientId: string, clientName: string) => ({ label: clientName, path: `/client/${clientId}` }),
  keys: { label: "Llaves", path: "/keys" },
  key: (keyId: string, keyCode: string) => ({ label: keyCode, path: `/keys/${keyId}` }),
  batchs: { label: "Lotes", path: "/batchs" },
  batch: (batchId: string, batchName: string) => ({ label: batchName, path: `/batchs/${batchId}` }),
  keyTypes: { label: "Tipos de Llaves", path: "/key-types" },
  keyType: (keyTypeId: string, keyTypeName: string) => ({ label: keyTypeName, path: `/key-types/${keyTypeId}` }),
};
