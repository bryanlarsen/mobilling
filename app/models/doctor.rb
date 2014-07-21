class Doctor < User

  default_scope -> {where(role: "doctor")}

end