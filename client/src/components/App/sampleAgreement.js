module.exports = {
  "required": [
    {
      "course": {
        "id": "MATH 192",
        "name": "Analytic Geometry and Calculus I",
        "units": 5,
        "prerequisites": [
          "Placement through the assessment process",
          "MATH-191"
        ],
        "recommended": [
          "Eligibility for ENGL 122"
        ]
      },
      "equals": {
        "id": "MATH 1A",
        "name": "Calculus",
        "units": 4
      }
    },
    {
      "course": {
        "id": "MATH 193",
        "name": "Analytic Geometry and Calculus II",
        "units": 5,
        "prerequisites": [
          "MATH-192"
        ],
        "recommended": [
          "Eligibility for ENGL 122"
        ]
      },
      "equals": {
        "id": "MATH 1B",
        "name": "Calculus",
        "units": 4
      }
    },
    {
      "course": {
        "id": "MATH 292",
        "name": "Analytic Geometry and Calculus III",
        "units": 5,
        "prerequisites": [
          "MATH-193"
        ]
      },
      "equals": {
        "id": "MATH 53",
        "name": "Multivariable Calculus",
        "units": 4
      }
    },
    {
      "course": {
        "relation": "ampersand",
        "parts": [
          {
            "course": {
              "id": "MATH 194",
              "name": "Linear Algebra",
              "units": 3,
              "prerequisites": [
                "MATH-193"
              ],
              "recommended": [
                "Eligibility for ENGL 122"
              ]
            }
          },
          {
            "course": {
              "id": "MATH 294",
              "name": "Differential Equations",
              "units": 5,
              "prerequisites": [
                "MATH-292"
              ],
              "recommended": [
                "MATH-194 (may be taken concurrently)"
              ]
            }
          }
        ]
      },
      "equals": {
        "id": "MATH 54",
        "name": "Linear Algebra and Differential Equations",
        "units": 4
      }
    },
    {
      "course": {
        "id": "PHYS 130",
        "name": "Physics for Engineers and Scientists A: Mechanics and Wave Motion",
        "units": 4,
        "recommended": [
          "Eligibility for ENGL 122"
        ],
        "notes": "For those students who have not recently completed a full year of high school physics, completion of PHYS-129 is strongly recommended."
      },
      "equals": {
        "id": "PHYSICS 7A",
        "name": "Physics for Scientists and Engineers",
        "units": 4
      }
    },
    {
      "course": {
        "id": "PHYS 230",
        "name": "Physics for Engineers and Scientists B: Heat and Electro-Magnetism",
        "units": 4,
        "prerequisites": [
          "MATH-292 (may be taken concurrently)"
        ],
        "recommended": [
          "Eligibility for ENGL 122"
        ]
      },
      "equals": {
        "id": "PHYSICS 7B",
        "name": "Physics for Scientists and Engineers",
        "units": 4
      }
    },
    {
      "course": {
        "id": "ENGL 122",
        "name": "Freshman English: Composition and Reading",
        "units": 3,
        "prerequisites": [
          "ENGL-116",
          "ENGL-117",
          "ESL-117A",
          "reading/writing assessment"
        ]
      },
      "equals": {
        "id": "ENGLISH R1A",
        "name": "Reading and Composition",
        "units": 4
      }
    },
    {
      "course": {
        "relation": "or",
        "parts": [
          {
            "course": {
              "id": "ENGL 123",
              "name": "Critical Thinking: Composition and Literature",
              "units": 3,
              "prerequisites": [
                "ENGL 122"
              ]
            }
          },
          {
            "course": {
              "id": "ENGL 126",
              "name": "Critical Thinking: The Shaping of Meaning in Language",
              "units": 3,
              "prerequisites": [
                "ENGL 122"
              ]
            }
          }
        ]
      },
      "equals": {
        "id": "ENGLISH R1B",
        "name": "Reading and Composition",
        "units": 4
      }
    },
    {
      "relation": "parallel or",
      "parts": [
        {
          "course": {
            "articulated": false
          },
          "equals": {
            "id": "ASTRON 7A",
            "name": "Introduction to Astrophysics",
            "units": 4
          }
        },
        {
          "course": {
            "articulated": false
          },
          "equals": {
            "id": "ASTRON 7B",
            "name": "Introduction to Astrophysics",
            "units": 4
          }
        },
        {
          "course": {
            "id": "BIOSC 130",
            "name": "Principles of Cellular and Molecular Biology",
            "units": 5,
            "prerequisites": [
              "CHEM-120"
            ],
            "recommended": [
              "BIOSC-101",
              "102"
            ]
          },
          "equals": {
            "relation": "ampersand",
            "parts": [
              {
                "equals": {
                  "id": "BIOLOGY 1A",
                  "name": "General Biology Lecture (Cells, Genetics, Animal Form & Function)",
                  "units": 3
                }
              },
              {
                "equals": {
                  "id": "BIOLOGY 1AL",
                  "name": "General Biology Laboratory",
                  "units": 2
                }
              }
            ]
          }
        },
        {
          "course": {
            "id": "BIOSC 131",
            "name": "Principles of Organismal Biology, Evolution and Ecology",
            "units": 5,
            "prerequisites": [
              "CHEM-120 (may be taken concurrently)"
            ],
            "recommended": [
              "BIOSC-101",
              "102"
            ]
          },
          "equals": {
            "id": "BIOLOGY 1B",
            "name": "General Biology (Plant Form & Function, Ecology, Evolution)",
            "units": 4
          }
        },
        {
          "course": {
            "id": "CHEM 120",
            "name": "General College Chemistry I",
            "units": 5,
            "prerequisites": [
              "CHEM-108",
              "score of 3,4",
              "5 on AP Chemistry Test",
              "appropriate chemistry skill level demonstrated through Chemistry Diagnostic Test"
            ],
            "recommended": [
              "Eligibility for ENGL 122"
            ]
          },
          "equals": {
            "relation": "ampersand",
            "parts": [
              {
                "equals": {
                  "id": "CHEM 1A",
                  "name": "General Chemistry",
                  "units": 3
                }
              },
              {
                "equals": {
                  "id": "CHEM 1AL",
                  "name": "General Chemistry Laboratory",
                  "units": 1
                }
              }
            ]
          }
        },
        {
          "course": {
            "id": "CHEM 121",
            "name": "General College Chemistry II",
            "units": 5,
            "prerequisites": [
              "CHEM-120"
            ]
          },
          "equals": {
            "id": "CHEM 1B",
            "name": "General Chemistry",
            "units": 4
          }
        },
        {
          "course": {
            "id": "CHEM 226",
            "name": "Organic Chemistry I",
            "units": 5,
            "prerequisites": [
              "CHEM-121"
            ]
          },
          "equals": {
            "relation": "ampersand",
            "parts": [
              {
                "equals": {
                  "id": "CHEM 3A",
                  "name": "Chemical Structure and Reactivity",
                  "units": 3
                }
              },
              {
                "equals": {
                  "id": "CHEM 3AL",
                  "name": "Organic Chemistry Laboratory",
                  "units": 2
                }
              }
            ]
          }
        },
        {
          "course": {
            "id": "CHEM 227",
            "name": "Organic Chemistry II",
            "units": 5,
            "prerequisites": [
              "CHEM-121"
            ]
          },
          "equals": {
            "relation": "ampersand",
            "parts": [
              {
                "equals": {
                  "id": "CHEM 3B",
                  "name": "Chemical Structure and Reactivity",
                  "units": 3
                }
              },
              {
                "equals": {
                  "id": "CHEM 3BL",
                  "name": "Organic Chemistry Laboratory",
                  "units": 2
                }
              }
            ]
          }
        },
        {
          "course": {
            "relation": "or",
            "parts": [
              {
                "course": {
                  "id": "BIOSC 120",
                  "name": "Introduction to Human Anatomy and Physiology",
                  "units": 5,
                  "recommended": [
                    "Eligibility for ENGL 122"
                  ]
                }
              },
              {
                "course": {
                  "id": "BIOSC 140",
                  "name": "Human Physiology",
                  "units": 5,
                  "prerequisites": [
                    "BIOSC-120",
                    "139"
                  ],
                  "recommended": [
                    "BIOSC-102"
                  ],
                  "notes": "This course is primarily intended for Nursing, Allied Health, Dental Hygiene, Kinesiology, and other health related majors."
                }
              }
            ]
          },
          "equals": {
            "relation": "ampersand",
            "parts": [
              {
                "equals": {
                  "id": "MCELLBI 32",
                  "name": "Introduction to Human Physiology",
                  "units": 3
                }
              },
              {
                "equals": {
                  "id": "MCELLBI 32L",
                  "name": "Introduction to Human Physiology Laboratory",
                  "units": 2
                }
              }
            ]
          }
        },
        {
          "course": {
            "id": "PHYS 231",
            "name": "Physics for Engineers and Scientists C: Optics and Modern Physics",
            "units": 4,
            "prerequisites": [
              "MATH-294 (may be taken concurrently)"
            ],
            "recommended": [
              "Eligibility for ENGL-122"
            ]
          },
          "equals": {
            "id": "PHYSICS 7C",
            "name": "Physics for Scientists and Engineers",
            "units": 4
          }
        }
      ]
    }
  ],
  "recommended": [
    {
      "course": {
        "articulated": false
      },
      "equals": {
        "id": "COMPSCI 61A",
        "name": "The Structure and Interpretation of Computer Programs",
        "units": 4
      }
    },
    {
      "course": {
        "id": "COMSC 210",
        "name": "Program Design and Data Structures",
        "units": 4,
        "prerequisites": [
          "COMSC-165"
        ],
        "recommended": [
          "COMSC-200"
        ]
      },
      "equals": {
        "id": "COMPSCI 61B",
        "name": "Data Structures",
        "units": 4
      }
    },
    {
      "course": {
        "id": "COMSC 260",
        "name": "Assembly Language Programming/Computer Organization",
        "units": 4,
        "prerequisites": [
          "COMSC-165"
        ]
      },
      "equals": {
        "id": "COMPSCI 61C",
        "name": "Machine Structures",
        "units": 4
      }
    },
    {
      "course": {
        "articulated": false
      },
      "equals": {
        "id": "EL ENG 16A",
        "name": "Designing Information Devices and Systems I",
        "units": 4
      }
    },
    {
      "course": {
        "articulated": false
      },
      "equals": {
        "id": "EL ENG 16B",
        "name": "Designing Information Devices and Systems II",
        "units": 4
      }
    },
    {
      "course": {
        "articulated": false
      },
      "equals": {
        "id": "COMPSCI 70",
        "name": "Discrete Mathematics and Probability Theory",
        "units": 4
      }
    }
  ]
};