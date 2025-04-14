// This file simulates a database
const config = require('../config/config');

// Use localhost with port when running locally
const BASE_URL = process.env.BASE_URL;

const resourcesData = {
  spaces: [
    {
      id: 1,
      name: "Snell Booking",
      description:
        "Reserve study rooms in Snell Library for group work or individual study. Available for 3-hour blocks with multimedia support and whiteboard facilities. Perfect for project meetings and study sessions. Extended Info: Also known as 'Snell Reservations' or 'Snell Scheduling'; ideal for group discussions, solo study, brainstorming sessions, exam preparations, tutoring meetings, collaborative projects, quiet study retreats, conference-style meetings, interactive seminars, and academic workshops.",
      navigateTo: "https://northeastern.libcal.com/reserve/",
      chips: ["Study Room", "Group Work", "Quiet Space"],
      hasViewStatus: true,
      image: `${BASE_URL}/images/rishabh.png`, // Updated path
    },
    {
      id: 2,
      name: "Room Reserve",
      description:
        "Book classrooms and collaborative spaces across campus. Reservations can be made up to 2 weeks in advance with faculty approval. Includes AV equipment and flexible seating arrangements. Extended Info: Also referred to as 'Classroom Booking' or 'Venue Scheduling'; suitable for lectures, seminars, interactive workshops, team meetings, group projects, training sessions, conferences, roundtable discussions, presentation setups, and academic gatherings.",
      navigateTo: "https://dashboard.robinpowered.com/Northeastern/",
      chips: ["Classroom", "Meeting Space"],
      hasViewStatus: true,
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
  ],
  lockers: [
    {
      id: 3,
      name: "Laptop power bank",
      description:
        "Available at International Village Basement and EXP floors. Provides up to 8 hours of charge for most laptop models. Compatible with most major brands including Apple, Dell, and Lenovo devices. Extended Info: Also known as a 'portable battery pack' or 'laptop battery booster'; use cases include in-class recharging, mobile workstations, emergency power supply, extended study sessions, outdoor presentations, backup power during events, travel-ready power, on-the-go device support, temporary charging in labs, and quick power-ups between sessions.",
      locations: [
        "International Village Basement",
        "Second floor of EXP next to the student printers",
        "Third floor of EXP next to the student printers",
      ],
      navigateTo:
        "https://service.northeastern.edu/tech?id=kb_article&sysparm_article=KB000018991",
      chips: ["Power", "Charging", "Portable"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
  ],
  charger: [
    {
      id: 4,
      name: "MagSafe 2 charger",
      description:
        "For Apple MacBook charging. Compatible with MacBook Pro and MacBook Air models from 2012-2019. 85W power adapter with magnetic connection to prevent tripping hazards and device damage. Extended Info: Also termed a 'magnetic adapter' or 'Apple power unit'; use cases include secure charging for Mac notebooks, fast recharging during classes, prevention of cable tangles, desk docking support, travel-safe power delivery, emergency charging in libraries, efficient power-up in meetings, safe classroom charging, continuous study power, and reliable workstation energy.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_category&sys_id=b805ea7fdb45cdd0ca10819b13961934&catalog_id=-1",
      locations: [
        "Snell Library: Blue, Green, Orange: The Hub, near the front entrance",
      ],
      chips: ["Apple", "Charging"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 5,
      name: "Microsoft Surface charger",
      description:
        "For Surface devices. Supports all Surface models including Pro, Book, and Laptop series with 65W output. Features built-in USB-A port for simultaneous mobile device charging. Extended Info: Also known as 'Surface adapter' or 'Surface power supply'; use cases include recharging tablets, powering Surface notebooks, mobile workstation support, continuous power during presentations, backup charging in labs, portable device charging for classes, emergency power, student travel accessory, meeting room device support, and everyday device maintenance.",
      navigateTo: "#",
      locations: [
        "Cullinane: Red (lockers only): First-floor Student Collaboration Space",
      ],
      chips: ["Microsoft", "Surface"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 6,
      name: "USB-C adapter",
      description:
        "Universal USB-C adapter for various devices. Includes HDMI, USB-A, and ethernet ports for comprehensive connectivity. Perfect for presentations and connecting to external displays or peripherals. Extended Info: Also called a 'Type-C multiplexer' or 'universal connector'; its use cases cover extending peripheral compatibility, linking to external monitors, integrating HDMI outputs, network connections in classrooms, multimedia presentations, lab equipment interfacing, portable connectivity in meetings, technical demonstrations, flexible device interfacing, and seamless connectivity during events.",
      navigateTo: "#",
      chips: ["USB-C", "Adapter"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 7,
      name: "USB-C charger",
      description:
        "For devices with USB-C charging ports. Fast charging at 100W with power delivery for laptops and mobile devices. Compact design with foldable prongs for easy portability between classes. Extended Info: Also known as a 'Type-C charging unit' or 'USB-C power adapter'; useful for rapid device charging, sustained mobile power for on-the-go work, recharging laptops, emergency power-ups, travel charging convenience, classroom device maintenance, backup power for meetings, efficient presentation support, portable energy in labs, and regular study session power.",
      navigateTo: "#",
      chips: ["USB-C", "Charging"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
  ],
  laptop: [
    {
      id: 8,
      name: "Apple Laptop",
      description:
        "MacBook available for temporary use. Various models with different specifications including Pro and Air variants with the latest macOS. Pre-installed with Adobe Creative Cloud, Microsoft Office, and other academic software. Extended Info: Also referred to as a 'MacBook notebook' or 'Apple portable computer'; potential use cases include graphic design, video editing, programming, academic research, multimedia presentations, creative projects, digital art production, software development environments, classroom computing, and on-the-go study sessions.",
      navigateTo: "#",
      chips: ["Apple", "MacOS"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 9,
      name: "Windows Laptop",
      description:
        "Windows laptop available for temporary use. Various models with different specifications including HP and Dell models with Windows 11. Perfect for engineering software, CAD programs, and other Windows-specific applications. Extended Info: Also known as a 'PC notebook' or 'Windows portable computer'; practical for engineering simulations, CAD work, office productivity, software testing, document creation, multimedia editing, research data analysis, classroom assignments, interactive learning, and digital presentations.",
      navigateTo: "#",
      chips: ["Windows", "Temporary Use"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 10,
      name: "Microsoft Surface Laptop 3",
      description:
        "Laptop available for temporary use. Core i7 1.3 GHz, 16 GB RAM, 256 GB SSD with touch screen and stylus support. Ideal for digital note-taking, graphic design, and presentations. Includes detachable keyboard. Extended Info: Also called a 'Surface notebook' or 'Microsoft portable computer'; it can be used for digital notetaking, creative design, presentation delivery, mobile productivity, interactive learning, rapid brainstorming, lightweight computing tasks, flexible work sessions, academic project support, and touchscreen-driven tasks.",
      navigateTo: "#",
      chips: ["Microsoft", "Windows"],
      duration: "Up to 5 days",
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
  ],
  accessories: [
    {
      id: 11,
      name: "InFocus projector",
      description:
        "Portable projector for presentations. Supports HDMI and wireless connections with 1080p resolution and built-in speaker. Battery-powered option allows use in locations without power outlets. Extended Info: Also known as a 'portable projection system' or 'visual display unit'; useful in conference presentations, academic lectures, dynamic event demonstrations, multimedia displays, collaborative meetings, digital signage, classroom teachings, group seminars, business briefings, and interactive workshops.",
      navigateTo: "#",
      chips: ["Presentation", "Portable"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 12,
      name: "Microscopes",
      description:
        "Various microscopes available for academic use. Digital and optical options with magnification from 40x to 1000x. USB connection allows direct capture to your computer for lab reports and research documentation. Extended Info: Also referred to as 'optical magnifiers' or 'digital microscopes'; can be applied for biological research, lab experiments, classroom demonstrations, scientific specimen analysis, digital imaging, interactive study sessions, research documentation, quality inspection, experimental learning, and detailed visual examinations.",
      navigateTo: "https://cils.northeastern.edu/facilities/",
      chips: ["Lab", "Research"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
  ],
  camera: [
    {
      id: 13,
      name: "Ricoh Theta",
      description:
        "360-degree camera for immersive photography. Creates panoramic images and videos for virtual reality applications. Perfect for architectural documentation, event coverage, and interactive media projects. Extended Info: Also known as a '360° panoramic camera' or 'omnidirectional recorder'; suitable for immersive photography, virtual tour creation, environmental mapping, event documentation, creative storytelling, site surveys, interactive media production, digital panoramas, VR content capture, and artistic photography.",
      navigateTo: "#",
      chips: ["360°", "Photography"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 14,
      name: "Sony HandyCam",
      description:
        "HD video camera for recording. Professional-grade with 20x optical zoom and external microphone support. Stabilization technology ensures smooth footage even when recording while walking or moving. Extended Info: Also called an 'HD camcorder' or 'portable video recorder'; well-suited for event recording, professional media production, field reporting, digital journalism, video blogging, academic documentation, creative film-making, live event coverage, dynamic filming in motion, and quality recording.",
      navigateTo: "#",
      chips: ["Video", "Recording"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 15,
      name: "Samsung 360",
      description:
        "360-degree camera for virtual reality content. Waterproof design with 4K video capture and spatial audio recording. Compatible with most VR headsets and platforms for immersive project presentations. Extended Info: Also known as a '360° VR camera' or 'immersive video recorder'; use cases include VR content creation, panoramic videography, creative multimedia projects, underwater photography, professional filming, interactive media presentations, immersive documentation, spatial audio recording, dynamic event capture, and innovative video production.",
      navigateTo: "#",
      chips: ["360°", "VR"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
  ],
  "vending accessories": [
    {
      id: 16,
      name: "Bluetooth presenter",
      description:
        "Wireless presenter for slideshows. Includes laser pointer and programmable buttons with 30ft range. No setup required - plug and play with any computer for immediate presentation control. Extended Info: Also referred to as a 'wireless presentation remote' or 'slide controller'; ideal for advancing slides, lecture navigation, business meeting facilitation, conference presentation control, classroom teaching, seminar guidance, training session coordination, public speaking aid, digital presentation management, and interactive sessions.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_category&sys_id=b805ea7fdb45cdd0ca10819b13961934&catalog_id=-1",
      locations: [
        "Snell Library: Blue, Green, Orange: The Hub, near the front entrance",
      ],
      chips: ["Presentation", "Wireless"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 17,
      name: "Voice recorder",
      description:
        "Digital recorder for lectures and interviews. High-quality mic with noise cancellation and 32GB storage. Automatic transcription services available through Husky account integration. Extended Info: Also known as an 'audio recorder' or 'sound capture device'; practical for lecture recordings, interview documentation, meeting minutes, field recordings, podcast creation, academic note-taking, voice memo capture, group discussion recording, transcription-based research, and oral presentations.",
      navigateTo: "https://northeastern.libcal.com/reserve/videoequipment",
      locations: [
        "Cullinane: Red (lockers only): First-floor Student Collaboration Space",
      ],
      chips: ["Audio", "Recording"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 18,
      name: "Bluetooth presenter",
      description:
        "Wireless presenter for slideshows. Compact design with rechargeable battery and universal compatibility. Includes timer function with vibration alerts to help pace your presentations effectively. Extended Info: Also identified as a 'wireless remote' or 'slide navigator'; useful for controlling slide advancements, remote presentation management, training session assistance, classroom instruction aid, seminar pacing, business meeting facilitation, interactive lecture control, session timing, portable conference support, and smooth presentation delivery.",
      navigateTo: "#",
      chips: ["Presentation", "Wireless"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 19,
      name: "MagSafe 2 charger",
      description:
        "For Apple MacBook charging. Available through vending machines with rental or purchase options. Includes international plug adapters for students traveling abroad or presenting at international conferences. Extended Info: Also called an 'Apple magnetic charger' or 'MacBook power adapter'; application scenarios include efficient Mac charging, travel-friendly power, classroom recharging stations, event-based backup power, international compatibility, portable charging for academics, conference room support, secure docking power, emergency charging, and quick energy supply.",
      navigateTo: "#",
      chips: ["Apple", "Charging"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 20,
      name: "Microsoft Surface charger",
      description:
        "For Surface devices. Self-service rental available with your student ID for up to 72 hours. Includes extension cord for flexibility in classrooms with limited outlet access. Extended Info: Also known as a 'Surface power adapter' or 'Surface charger'; use cases include Surface notebook charging, on-the-go power support, backup energy during classes, emergency device charging, flexible lab power solutions, travel charging, meeting room device support, efficient power delivery in presentations, portable recharge aid, and routine device maintenance.",
      navigateTo: "#",
      chips: ["Microsoft", "Surface"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 21,
      name: "USB-C adapter",
      description:
        "Universal USB-C adapter for various devices. Available in vending machines with hourly or daily rental options. Essential for connecting to legacy devices or presenting in classrooms with older AV systems. Extended Info: Also referred to as a 'Type-C universal adapter' or 'multiport connector'; its applications include peripheral connectivity, classroom equipment integration, legacy device interfacing, multimedia presentation support, data transfer facilitation, AV system adaptation, portable connectivity in meetings, network interfacing, teaching demonstrations, and flexible device integration.",
      navigateTo: "#",
      chips: ["USB-C", "Adapter"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 22,
      name: "USB-C charger",
      description:
        "For devices with USB-C charging ports. Self-checkout from vending machines with return to any location. Supports multiple fast charging standards including Power Delivery, Quick Charge, and SuperVOOC. Extended Info: Also known as a 'Type-C power adapter' or 'USB-C energy unit'; useful for rapid charging, maintaining mobile device uptime, emergency recharging, travel-friendly power supply, classroom device maintenance, conference room charging, reliable power delivery, student convenience charging, professional device support, and everyday power replenishment.",
      navigateTo: "#",
      chips: ["USB-C", "Charging"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
  ],
  "working with gpus": [
    {
      id: 23,
      name: "HPC (High Powered Computing) GPU Access",
      description:
        "Access to high-performance computing resources with GPU capabilities. Includes NVIDIA A100 and V100 GPUs for machine learning applications. Priority access available for research and capstone projects. Extended Info: Also called 'High Performance GPU Access' or 'Advanced GPU computing resource'; use cases encompass machine learning training, deep learning research, AI model development, scientific computing, high-end data processing, simulation and rendering tasks, complex algorithm training, computational fluid dynamics, visual effects processing, and academic research in AI.",
      navigateTo: "https://rc-docs.northeastern.edu/en/latest/index.html",
      chips: ["HPC", "GPU"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
    {
      id: 24,
      name: "Cluster Job Submission",
      description:
        "Submit computational jobs to the university's computing cluster. Supports TensorFlow, PyTorch and other frameworks with priority scheduling. Includes containerization support for reproducible research environments. Extended Info: Also known as 'Computational cluster submission' or 'distributed computing job entry'; applicable for scientific computing tasks, big data processing, high-performance algorithm testing, simulation runs, machine learning workloads, research project computations, distributed processing, programming competitions, academic data analysis, and scalable research operations.",
      navigateTo: "#",
      chips: ["Computing", "Research"],
      image: `${BASE_URL}/images/laptop.png`, // Updated path
    },
  ],
};

module.exports = resourcesData;
