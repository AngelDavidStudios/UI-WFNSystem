
export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}

export interface ApiResponse<T = any> {
  data: T;
  error?: string;
  status: number;
}

export interface Direccion {
  iD_Direccion?: string;
  calle: string;
  numero: string;
  piso: string;
}

export interface DireccionFormData {
  calle: string;
  numero: string;
  piso: string;
}

export interface Persona {
  iD_Persona?: string;
  dni: string;
  gender: string;
  primerNombre: string;
  segundoNombre: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  dateBirthday: string;
  edad: number;
  correo: string[];
  telefono: string[];
  direcciones: Direccion[];
  dateCreated?: string;
}

export interface PersonaFormData {
  dni: string;
  gender: string;
  primerNombre: string;
  segundoNombre: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  dateBirthday: string;
  edad: number;
  correo: string[];
  telefono: string[];
}

export interface Departamento {
  iD_Departamento?: string;
  nombre: string;
  ubicacion: string;
  email: string;
  telefono: string;
  cargo: string;
  centroCosto: string;
}

export interface DepartamentoFormData {
  nombre: string;
  ubicacion: string;
  email: string;
  telefono: string;
  cargo: string;
  centroCosto: string;
}

export interface Banco {
  iD_Banking?: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  swiftCode: string;
  pais: string;
  sucursal: string;
}

export interface BancoFormData {
  bankName: string;
  accountNumber: string;
  accountType: string;
  swiftCode: string;
  pais: string;
  sucursal: string;
}

export interface Empleado {
  iD_Empleado?: string;
  iD_Persona: string;
  bankingAccounts: Banco[];
  iD_Departamento: string;
  fechaIngreso: string;
  salarioBase: number;
  is_DecimoTercMensual: boolean;
  is_DecimoCuartoMensual: boolean;
  is_FondoReserva: boolean;
  dateCreated?: string;
  statusLaboral: number;
}

export interface EmpleadoFormData {
  iD_Persona: string;
  bankingAccounts: string[];
  iD_Departamento: string;
  fechaIngreso: string;
  salarioBase: number;
  is_DecimoTercMensual: boolean;
  is_DecimoCuartoMensual: boolean;
  is_FondoReserva: boolean;
  statusLaboral: number;
}

export interface Provision {
  iD_Provision?: string;
  iD_Empleado: string;
  tipoProvision: string;
  periodo: string;
  valorMensual: number;
  acumulado: number;
  total: number;
  isTrasnferred: boolean;
}

export interface ProvisionFormData {
  iD_Empleado: string;
  tipoProvision: string;
  periodo: string;
  valorMensual: number;
  acumulado: number;
  total: number;
  isTrasnferred: boolean;
}

export interface Parametro {
  iD_Parametro?: string;
  tipo: string;
  descripcion: string;
  dateCreated?: string;
}

export interface ParametroFormData {
  tipo: string;
  descripcion: string;
}

export interface Novedad {
  iD_Novedad?: string;
  iD_Parametro: string;
  fechaIngresada: string;
  tipoNovedad: string;
  descripcion: string;
  montoAplicado: number;
  is_Gravable: boolean;
}

export interface NovedadFormData {
  iD_Parametro: string;
  fechaIngresada: string;
  tipoNovedad: string;
  descripcion: string;
  montoAplicado: number;
  is_Gravable: boolean;
}

export interface NovedadNomina {
  iD_Novedad: string;
  iD_Parametro: string;
  fechaIngresada: string;
  tipoNovedad: string;
  descripcion: string;
  montoAplicado: number;
  is_Gravable: boolean;
}

export interface Ingreso {
  iD_Ingreso: string;
  novedades: NovedadNomina[];
  subTotal_Gravado_IESS: number;
  subTotal_No_Gravado_IESS: number;
  totalIngresos: number;
  dateCreated: string;
}

export interface IngresoFormData {
  novedades: NovedadNomina[];
}

export interface Egreso {
  iD_Egreso: string;
  novedades: NovedadNomina[];
  totalEgresos: number;
  dateCreated: string;
}

export interface EgresoFormData {
  novedades: NovedadNomina[];
}

export interface Nomina {
  iD_Nomina?: string;
  iD_Empleado: string;
  periodo: string;
  ingresos: Ingreso[];
  egresos: Egreso[];
  totalIngresos: number;
  totalEgresos: number;
  netoAPagar: number;
}

export interface NominaFormData {
  iD_Empleado: string;
  periodo: string;
  ingresos: IngresoFormData[];
  egresos: EgresoFormData[];
}

export interface Workspace {
  iD_Workspace?: string;
  nombre: string;
  periodo: string;
  nominas: Nomina[];
  fechaCreacion: string;
  fechaCierre: string;
  estado: number;
}

export interface WorkspaceFormData {
  fechaCreacion: string;
  fechaCierre: string;
  estado: number;
}
