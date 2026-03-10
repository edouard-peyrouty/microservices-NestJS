export class User {
  id: string;
  nom: string;
  email: string;
  role: string;

  constructor(id: string, nom: string, email: string, role: string) {
    this.id = id;
    this.nom = nom;
    this.email = email;
    this.role = role;
  }
}