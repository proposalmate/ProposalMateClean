// Template data for wedding proposal templates
const weddingTemplates = {
  photography: {
    name: "Wedding Photography",
    description: "A premium template for wedding photographers to showcase their packages and portfolio",
    sections: [
      {
        title: "Introduction",
        content: "Thank you for considering our photography services for your special day. This proposal outlines our approach, packages, and how we'll capture the beautiful moments of your wedding."
      },
      {
        title: "Our Style",
        content: "We specialize in a blend of documentary and fine art photography, focusing on authentic moments while creating timeless, elegant portraits."
      },
      {
        title: "Packages",
        content: [
          {
            name: "Essential",
            price: "£1,200",
            features: [
              "6 hours of coverage",
              "1 photographer",
              "Online gallery with 300+ edited images",
              "Print release"
            ]
          },
          {
            name: "Classic",
            price: "£1,800",
            features: [
              "8 hours of coverage",
              "2 photographers",
              "Engagement session",
              "Online gallery with 500+ edited images",
              "Print release",
              "USB with high-resolution images"
            ]
          },
          {
            name: "Premium",
            price: "£2,500",
            features: [
              "10 hours of coverage",
              "2 photographers",
              "Engagement session",
              "Bridal session",
              "Online gallery with 700+ edited images",
              "Print release",
              "USB with high-resolution images",
              "20-page wedding album"
            ]
          }
        ]
      },
      {
        title: "Process",
        content: "1. Initial consultation\n2. Booking and contract\n3. Pre-wedding planning\n4. Wedding day coverage\n5. Image editing (4-6 weeks)\n6. Image delivery\n7. Album design (if applicable)"
      },
      {
        title: "Portfolio",
        content: "Please view our portfolio at the following link: [Portfolio Link]"
      }
    ]
  },
  planning: {
    name: "Wedding Planning",
    description: "A comprehensive template for wedding planners to outline their services and process",
    sections: [
      {
        title: "Introduction",
        content: "Thank you for considering our wedding planning services. This proposal outlines how we can help make your wedding day perfect, stress-free, and memorable."
      },
      {
        title: "Our Approach",
        content: "We believe in creating personalized, meaningful celebrations that reflect your unique love story and vision. Our approach combines creativity, meticulous organization, and flawless execution."
      },
      {
        title: "Services",
        content: [
          {
            name: "Month-of Coordination",
            price: "£800",
            features: [
              "3 planning meetings",
              "Vendor coordination",
              "Timeline creation",
              "Rehearsal direction",
              "Full wedding day coordination (10 hours)"
            ]
          },
          {
            name: "Partial Planning",
            price: "£1,500",
            features: [
              "6 planning meetings",
              "Vendor recommendations and coordination",
              "Budget management",
              "Timeline creation",
              "Rehearsal direction",
              "Full wedding day coordination (12 hours)"
            ]
          },
          {
            name: "Full Planning",
            price: "£3,000",
            features: [
              "Unlimited planning meetings",
              "Venue selection",
              "Complete vendor management",
              "Design and styling",
              "Budget management",
              "Timeline creation",
              "Rehearsal direction",
              "Full wedding day coordination (14 hours)"
            ]
          }
        ]
      },
      {
        title: "Planning Process",
        content: "1. Initial consultation\n2. Vision and concept development\n3. Budget planning\n4. Vendor selection\n5. Design and styling\n6. Logistics and timeline\n7. Final details\n8. Rehearsal\n9. Wedding day execution"
      },
      {
        title: "Previous Weddings",
        content: "Please view our portfolio of previous weddings: [Portfolio Link]"
      }
    ]
  },
  venue: {
    name: "Wedding Venue",
    description: "An elegant template for wedding venues to showcase their spaces and packages",
    sections: [
      {
        title: "Introduction",
        content: "Thank you for considering our venue for your wedding celebration. This proposal outlines our spaces, packages, and how we can create the perfect setting for your special day."
      },
      {
        title: "Our Venue",
        content: "Our historic venue offers a blend of timeless elegance and modern amenities, set in 5 acres of landscaped gardens with stunning views and photo opportunities."
      },
      {
        title: "Spaces",
        content: [
          {
            name: "Grand Ballroom",
            capacity: "Up to 200 guests",
            description: "Our largest space featuring crystal chandeliers, hardwood floors, and floor-to-ceiling windows overlooking the gardens."
          },
          {
            name: "Garden Terrace",
            capacity: "Up to 150 guests",
            description: "A beautiful outdoor space with a permanent marquee, perfect for ceremonies or receptions in spring and summer."
          },
          {
            name: "Intimate Library",
            capacity: "Up to 60 guests",
            description: "A charming room with original features, ideal for smaller weddings or as a reception drinks area."
          }
        ]
      },
      {
        title: "Packages",
        content: [
          {
            name: "Essential",
            price: "£3,500",
            features: [
              "Venue hire for ceremony and reception (8 hours)",
              "Basic setup and cleanup",
              "Tables and chairs",
              "Parking for guests",
              "Bridal suite access"
            ]
          },
          {
            name: "Classic",
            price: "£5,500",
            features: [
              "Venue hire for ceremony and reception (10 hours)",
              "Setup and cleanup",
              "Tables, chairs, and linens",
              "Basic lighting package",
              "Parking for guests",
              "Bridal suite access",
              "Dedicated venue coordinator"
            ]
          },
          {
            name: "Premium",
            price: "£7,500",
            features: [
              "Exclusive venue hire for entire day",
              "Setup and cleanup",
              "Premium tables, chairs, and linens",
              "Enhanced lighting package",
              "Parking for guests",
              "Bridal suite access",
              "Dedicated venue coordinator",
              "Champagne welcome reception",
              "Menu tasting for up to 4 people"
            ]
          }
        ]
      },
      {
        title: "Catering",
        content: "We work with a selection of preferred caterers who offer a range of cuisines and service styles. We can provide recommendations based on your preferences and budget."
      },
      {
        title: "Additional Services",
        content: "- In-house bar service\n- Furniture rentals\n- Lighting packages\n- Accommodation recommendations\n- Preferred vendor list"
      }
    ]
  },
  catering: {
    name: "Wedding Catering",
    description: "A detailed template for wedding caterers to present their menus and services",
    sections: [
      {
        title: "Introduction",
        content: "Thank you for considering our catering services for your wedding celebration. This proposal outlines our approach to wedding catering, menu options, and how we'll create a memorable dining experience for you and your guests."
      },
      {
        title: "Our Approach",
        content: "We believe food is a central part of any celebration. Our team creates seasonal, locally-sourced menus that can be customized to reflect your tastes, cultural traditions, and dietary requirements."
      },
      {
        title: "Service Styles",
        content: [
          {
            name: "Plated Service",
            description: "Elegant, formal dining experience with individually plated courses served to seated guests."
          },
          {
            name: "Family Style",
            description: "Communal dining experience with large platters of food placed at each table for guests to share."
          },
          {
            name: "Buffet",
            description: "Casual, flexible dining experience with food stations where guests serve themselves."
          },
          {
            name: "Food Stations",
            description: "Interactive experience with themed food stations around the venue, allowing guests to mingle and sample various cuisines."
          }
        ]
      },
      {
        title: "Sample Menus",
        content: [
          {
            name: "Classic Menu",
            price: "£55 per person",
            items: [
              "Starter: Garden salad with seasonal vegetables and house vinaigrette",
              "Main: Herb-roasted chicken with garlic mashed potatoes and seasonal vegetables",
              "Dessert: Classic vanilla cheesecake with berry compote"
            ]
          },
          {
            name: "Premium Menu",
            price: "£75 per person",
            items: [
              "Starter: Seared scallops with pea puree and crispy pancetta",
              "Main: Filet mignon with truffle butter, roasted potatoes, and asparagus",
              "Dessert: Chocolate fondant with vanilla ice cream and salted caramel sauce"
            ]
          },
          {
            name: "Vegetarian Menu",
            price: "£55 per person",
            items: [
              "Starter: Roasted beetroot and goat cheese salad with candied walnuts",
              "Main: Wild mushroom risotto with truffle oil and parmesan crisp",
              "Dessert: Lemon tart with raspberry sorbet"
            ]
          }
        ]
      },
      {
        title: "Bar Services",
        content: [
          {
            name: "Standard Bar",
            price: "£25 per person",
            features: [
              "4-hour service",
              "House wine, beer, and soft drinks"
            ]
          },
          {
            name: "Premium Bar",
            price: "£35 per person",
            features: [
              "5-hour service",
              "House wine, beer, premium spirits, and soft drinks",
              "Two signature cocktails"
            ]
          },
          {
            name: "Luxury Bar",
            price: "£45 per person",
            features: [
              "6-hour service",
              "Premium wine, craft beer, top-shelf spirits, and soft drinks",
              "Three signature cocktails",
              "Champagne toast"
            ]
          }
        ]
      },
      {
        title: "Additional Services",
        content: "- Menu tasting session\n- Cake cutting service\n- Late-night snacks\n- Staff (1 server per 15 guests)\n- Rental coordination\n- Setup and cleanup"
      }
    ]
  }
};

// Export the templates
window.WeddingTemplates = weddingTemplates;
