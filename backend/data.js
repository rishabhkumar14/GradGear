const laptopImg = ""//require("./assets/laptop.png")

const resourcesData = {
  spaces: [
    {
      id: 1,
      name: "Snell Booking",
      description:
        "Reserve study rooms in Snell Library for group work or individual study. Available for 3-hour blocks with multimedia support and whiteboard facilities. Perfect for project meetings and study sessions.",
      navigateTo: "https://northeastern.libcal.com/reserve/",
      chips: ["Study Room", "Group Work", "Quiet Space"],
      hasViewStatus: true,
      image: laptopImg,
    },
    {
      id: 2,
      name: "Room Reserve",
      description:
        "Book classrooms and collaborative spaces across campus. Reservations can be made up to 2 weeks in advance with faculty approval. Includes AV equipment and flexible seating arrangements.",
      navigateTo: "https://dashboard.robinpowered.com/Northeastern/",
      chips: ["Classroom", "Meeting Space"],
      hasViewStatus: true,
      image: laptopImg,
    },
  ],
  lockers: [
    {
      id: 3,
      name: "Laptop power bank",
      description:
        "Available at International Village Basement and EXP floors. Provides up to 8 hours of charge for most laptop models. Compatible with most major brands including Apple, Dell, and Lenovo devices.",
      locations: [
        "International Village Basement",
        "Second floor of EXP next to the student printers",
        "Third floor of EXP next to the student printers",
      ],
      navigateTo:
        "https://service.northeastern.edu/tech?id=kb_article&sysparm_article=KB000018991",
      chips: ["Power", "Charging", "Portable"],
      image: laptopImg,
    },
  ],
  charger: [
    {
      id: 4,
      name: "MagSafe 2 charger",
      description:
        "For Apple MacBook charging. Compatible with MacBook Pro and MacBook Air models from 2012-2019. 85W power adapter with magnetic connection to prevent tripping hazards and device damage.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_category&sys_id=b805ea7fdb45cdd0ca10819b13961934&catalog_id=-1",
      locations: [
        "Snell Library: Blue, Green, Orange: The Hub, near the front entrance",
      ],
      chips: ["Apple", "Charging"],
      image: laptopImg,
    },
    {
      id: 5,
      name: "Microsoft Surface charger",
      description:
        "For Surface devices. Supports all Surface models including Pro, Book, and Laptop series with 65W output. Features built-in USB-A port for simultaneous mobile device charging.",
      navigateTo: "#",
      locations: [
        "Cullinane: Red (lockers only): First-floor Student Collaboration Space",
      ],
      chips: ["Microsoft", "Surface"],
      image: laptopImg,
    },
    {
      id: 6,
      name: "USB-C adapter",
      description:
        "Universal USB-C adapter for various devices. Includes HDMI, USB-A, and ethernet ports for comprehensive connectivity. Perfect for presentations and connecting to external displays or peripherals.",
      navigateTo: "#",
      chips: ["USB-C", "Adapter"],
      image: laptopImg,
    },
    {
      id: 7,
      name: "USB-C charger",
      description:
        "For devices with USB-C charging ports. Fast charging at 100W with power delivery for laptops and mobile devices. Compact design with foldable prongs for easy portability between classes.",
      navigateTo: "#",
      chips: ["USB-C", "Charging"],
      image: laptopImg,
    },
  ],
  laptop: [
    {
      id: 8,
      name: "Apple Laptop",
      description:
        "MacBook available for temporary use. Various models with different specifications including Pro and Air variants with the latest macOS. Pre-installed with Adobe Creative Cloud, Microsoft Office, and other academic software.",
      navigateTo: "#",
      chips: ["Apple", "MacOS"],
      image: laptopImg,
    },
    {
      id: 9,
      name: "Windows Laptop",
      description:
        "Windows laptop available for temporary use. Various models with different specifications including HP and Dell models with Windows 11. Perfect for engineering software, CAD programs, and other Windows-specific applications.",
      navigateTo: "#",
      chips: ["Windows", "Temporary Use"],
      image: laptopImg,
    },
    {
      id: 10,
      name: "Microsoft Surface Laptop 3",
      description:
        "Laptop available for temporary use. Core i7 1.3 GHz, 16 GB RAM, 256 GB SSD with touch screen and stylus support. Ideal for digital note-taking, graphic design, and presentations. Includes detachable keyboard.",
      navigateTo: "#",
      chips: ["Microsoft", "Windows"],
      duration: "Up to 5 days",
      image: laptopImg,
    },
  ],
  accessories: [
    {
      id: 11,
      name: "InFocus projector",
      description:
        "Portable projector for presentations. Supports HDMI and wireless connections with 1080p resolution and built-in speaker. Battery-powered option allows use in locations without power outlets.",
      navigateTo: "#",
      chips: ["Presentation", "Portable"],
      image: laptopImg,
    },
    {
      id: 12,
      name: "Microscopes",
      description:
        "Various microscopes available for academic use. Digital and optical options with magnification from 40x to 1000x. USB connection allows direct capture to your computer for lab reports and research documentation.",
      navigateTo: "https://cils.northeastern.edu/facilities/",
      chips: ["Lab", "Research"],
      image: laptopImg,
    },
  ],
  camera: [
    {
      id: 13,
      name: "Ricoh Theta",
      description:
        "360-degree camera for immersive photography. Creates panoramic images and videos for virtual reality applications. Perfect for architectural documentation, event coverage, and interactive media projects.",
      navigateTo: "#",
      chips: ["360°", "Photography"],
      image: laptopImg,
    },
    {
      id: 14,
      name: "Sony HandyCam",
      description:
        "HD video camera for recording. Professional-grade with 20x optical zoom and external microphone support. Stabilization technology ensures smooth footage even when recording while walking or moving.",
      navigateTo: "#",
      chips: ["Video", "Recording"],
      image: laptopImg,
    },
    {
      id: 15,
      name: "Samsung 360",
      description:
        "360-degree camera for virtual reality content. Waterproof design with 4K video capture and spatial audio recording. Compatible with most VR headsets and platforms for immersive project presentations.",
      navigateTo: "#",
      chips: ["360°", "VR"],
      image: laptopImg,
    },
  ],
  "vending accessories": [
    {
      id: 16,
      name: "Bluetooth presenter",
      description:
        "Wireless presenter for slideshows. Includes laser pointer and programmable buttons with 30ft range. No setup required - plug and play with any computer for immediate presentation control.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_category&sys_id=b805ea7fdb45cdd0ca10819b13961934&catalog_id=-1",
      locations: [
        "Snell Library: Blue, Green, Orange: The Hub, near the front entrance",
      ],
      chips: ["Presentation", "Wireless"],
      image: laptopImg,
    },
    {
      id: 17,
      name: "Voice recorder",
      description:
        "Digital recorder for lectures and interviews. High-quality mic with noise cancellation and 32GB storage. Automatic transcription services available through Husky account integration.",
      navigateTo: "https://northeastern.libcal.com/reserve/videoequipment",
      locations: [
        "Cullinane: Red (lockers only): First-floor Student Collaboration Space",
      ],
      chips: ["Audio", "Recording"],
      image: laptopImg,
    },
    {
      id: 18,
      name: "Bluetooth presenter",
      description:
        "Wireless presenter for slideshows. Compact design with rechargeable battery and universal compatibility. Includes timer function with vibration alerts to help pace your presentations effectively.",
      navigateTo: "#",
      chips: ["Presentation", "Wireless"],
      image: laptopImg,
    },
    {
      id: 19,
      name: "MagSafe 2 charger",
      description:
        "For Apple MacBook charging. Available through vending machines with rental or purchase options. Includes international plug adapters for students traveling abroad or presenting at international conferences.",
      navigateTo: "#",
      chips: ["Apple", "Charging"],
      image: laptopImg,
    },
    {
      id: 20,
      name: "Microsoft Surface charger",
      description:
        "For Surface devices. Self-service rental available with your student ID for up to 72 hours. Includes extension cord for flexibility in classrooms with limited outlet access.",
      navigateTo: "#",
      chips: ["Microsoft", "Surface"],
      image: laptopImg,
    },
    {
      id: 21,
      name: "USB-C adapter",
      description:
        "Universal USB-C adapter for various devices. Available in vending machines with hourly or daily rental options. Essential for connecting to legacy devices or presenting in classrooms with older AV systems.",
      navigateTo: "#",
      chips: ["USB-C", "Adapter"],
      image: laptopImg,
    },
    {
      id: 22,
      name: "USB-C charger",
      description:
        "For devices with USB-C charging ports. Self-checkout from vending machines with return to any location. Supports multiple fast charging standards including Power Delivery, Quick Charge, and SuperVOOC.",
      navigateTo: "#",
      chips: ["USB-C", "Charging"],
      image: laptopImg,
    },
  ],
  "working with gpus": [
    {
      id: 23,
      name: "HPC (High Powered Computing) GPU Access",
      description:
        "Access to high-performance computing resources with GPU capabilities. Includes NVIDIA A100 and V100 GPUs for machine learning applications. Priority access available for research and capstone projects.",
      navigateTo: "https://rc-docs.northeastern.edu/en/latest/index.html",
      chips: ["HPC", "GPU"],
      image: laptopImg,
    },
    {
      id: 24,
      name: "Cluster Job Submission",
      description:
        "Submit computational jobs to the university's computing cluster. Supports TensorFlow, PyTorch and other frameworks with priority scheduling. Includes containerization support for reproducible research environments.",
      navigateTo: "#",
      chips: ["Computing", "Research"],
      image: laptopImg,
    },
  ],
};

exports.data = resourcesData;
