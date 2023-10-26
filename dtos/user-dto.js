module.exports = class UserDto {
  EMAIL;
  KOD;
  PWDHASH;
  KOD_UR;

  constructor(model) {
    this.EMAIL = model.EMAIL;
    this.KOD = model.KOD;
    this.PWDHASH = model.PWDHASH;
    this.KOD_UR = model.KOD_UR;
  }
};
