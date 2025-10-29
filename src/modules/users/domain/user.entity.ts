export class User {
  constructor(
    readonly id: string,
    readonly email: string,
    private _password?: string,
    private _firstName?: string,
    private _lastName?: string,
    private _avatar?: string,
    private _isVerified: boolean = false,
    private _phoneNumber?: string,
    private _role: 'ADMIN' | 'USER' = 'USER',
    readonly createdAt: Date = new Date(),
    readonly updatedAt: Date = new Date(),
    readonly deletedAt?: Date,
  ) { }

  get fullName(): string {
    return [this._firstName, this._lastName].filter(Boolean).join(' ');
  }

  verify(): void {
    this._isVerified = true;
  }

  changeRole(role: 'ADMIN' | 'USER'): void {
    this._role = role;
  }

  // Optional: Hide sensitive data (like password)
  toSafeObject() {
    return {
      id: this.id,
      email: this.email,
      firstName: this._firstName,
      lastName: this._lastName,
      avatar: this._avatar,
      isVerified: this._isVerified,
      phoneNumber: this._phoneNumber,
      role: this._role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
