// This file simulates a database
const config = require("../config/config");

// Use localhost with port when running locally
const BASE_URL = process.env.BASE_URL;

const resourcesData = {
  spaces: [
    {
      id: 1,
      name: "Snell Booking",
      description:
        "Reserve study rooms in Snell Library for group work or individual study. Available for 3-hour blocks with multimedia support and whiteboard facilities. Perfect for project meetings and study sessions.",
      details:
        "Reserve study rooms in Snell Library for group work or individual study. Available for 3-hour blocks with multimedia support and whiteboard facilities. Perfect for project meetings and study sessions. Each room is soundproofed and equipped with power outlets, high-speed Wi-Fi, and presentation capabilities. Rooms vary in size from intimate 2-person spaces to larger 12-person conference rooms, with some featuring specialized equipment for media production. Extended Info: Also known as 'Snell Reservations', 'Library Rooms', or 'Snell Scheduling'; ideal for group discussions, solo study, brainstorming sessions, exam preparations, tutoring meetings, collaborative projects, quiet study retreats, conference-style meetings, interactive seminars, academic workshops, rehearsing presentations, virtual interviews, online exams, team project planning, research collaborations, thesis writing, coding sessions, and video production projects.",
      navigateTo: "https://northeastern.libcal.com/reserve/",
      chips: ["Study Room", "Group Work", "Quiet Space"],
      // hasViewStatus: true,
      image: `${BASE_URL}/images/snell_library.jpg`,
    },
    {
      id: 2,
      name: "Room Reserve",
      description:
        "Book classrooms and collaborative spaces across campus. Reservations can be made up to 2 weeks in advance with faculty approval. Includes AV equipment and flexible seating arrangements.",
      details:
        "Book classrooms and collaborative spaces across campus. Reservations can be made up to 2 weeks in advance with faculty approval. Includes AV equipment and flexible seating arrangements. Spaces range from traditional classrooms to innovative collaboration zones with movable furniture and interactive displays. Most rooms feature document cameras, projectors, and enhanced acoustics for optimal learning environments. Extended Info: Also referred to as 'Classroom Booking', 'Campus Space Reservation', or 'Venue Scheduling'; suitable for lectures, seminars, interactive workshops, team meetings, group projects, training sessions, conferences, roundtable discussions, presentation rehearsals, networking events, student organization gatherings, club meetings, guest speaker events, panel discussions, mock interviews, debate practice, hackathons, product demonstrations, and interdisciplinary collaborations.",
      navigateTo: "https://dashboard.robinpowered.com/Northeastern/",
      chips: ["Classroom", "Meeting Space"],
      duration: "Upto 4 hours",

      // hasViewStatus: true,
      image: `${BASE_URL}/images/room.jpg`,
    },
  ],
  // lockers: [
  //   {
  //     id: 3,
  //     name: "Laptop power bank",
  //     description:
  //       "Available at International Village Basement and EXP floors. Provides up to 8 hours of charge for most laptop models. Compatible with most major brands including Apple, Dell, and Lenovo devices.",
  //     details:
  //       "Available at International Village Basement and EXP floors. Provides up to 8 hours of charge for most laptop models. Compatible with most major brands including Apple, Dell, and Lenovo devices. These high-capacity power banks feature multiple output ports (USB-C, USB-A) with fast-charging capabilities and LED indicators showing remaining power levels. Loan periods typically last 24 hours with potential for renewal if demand allows. Extended Info: Also known as 'portable battery pack', 'mobile power station', or 'laptop battery booster'; use cases include in-class recharging, mobile workstations, emergency power supply, extended study sessions, outdoor presentations, backup power during events, travel-ready power, on-the-go device support, temporary charging in labs, quick power-ups between sessions, powering devices during campus outages, fieldwork support, multi-day conferences, outdoor study groups, and collaborative work in non-traditional spaces.",
  //     locations: [
  //       "International Village Basement",
  //       "Second floor of EXP next to the student printers",
  //       "Third floor of EXP next to the student printers",
  //     ],
  //     navigateTo:
  //       "https://service.northeastern.edu/tech?id=kb_article&sysparm_article=KB000018991",
  //     chips: ["Power", "Charging", "Portable"],
  //     image: `${BASE_URL}/images/laptop_PB.png`,
  //   },
  // ],
  charger: [
    {
      id: 4,
      name: "MagSafe 2 charger",
      description:
        "For Apple MacBook charging. Compatible with MacBook Pro and MacBook Air models from 2012-2019. 85W power adapter with magnetic connection to prevent tripping hazards and device damage.",
      details:
        "For Apple MacBook charging. Compatible with MacBook Pro and MacBook Air models from 2012-2019. 85W power adapter with magnetic connection to prevent tripping hazards and device damage. Features over-temperature protection, surge protection, and automatic voltage adjustment for international use. The distinctive L-shaped connector design maintains Apple's signature aesthetics while providing a secure connection. Extended Info: Also termed a 'magnetic adapter', 'Mac power cable', or 'Apple power unit'; use cases include secure charging for Mac notebooks, fast recharging during classes, prevention of cable tangles, desk docking support, travel-safe power delivery, emergency charging in libraries, efficient power-up in meetings, safe classroom charging, continuous study power, reliable workstation energy, mid-presentation recharging, backup power solution, multi-day project support, lab work power source, and MacBook battery maintenance.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_category&sys_id=b805ea7fdb45cdd0ca10819b13961934&catalog_id=-1",
      locations: [
        "Snell Library: Blue, Green, Orange: The Hub, near the front entrance",
      ],
      chips: ["Apple", "Charging"],
      image: `${BASE_URL}/images/magsafe2.jpg`,
    },
    {
      id: 5,
      name: "Microsoft Surface charger",
      description:
        "For Surface devices. Supports all Surface models including Pro, Book, and Laptop series with 65W output. Features built-in USB-A port for simultaneous mobile device charging.",
      details:
        "For Surface devices. Supports all Surface models including Pro, Book, and Laptop series with 65W output. Features built-in USB-A port for simultaneous mobile device charging. The compact design includes a magnetic connection that detaches if accidentally pulled, protecting both the device and charger from damage. Capable of rapid charging that provides up to 80% battery in approximately one hour. Extended Info: Also known as 'Surface adapter', 'Surface power cord', or 'Surface power supply'; use cases include recharging tablets, powering Surface notebooks, mobile workstation support, continuous power during presentations, backup charging in labs, portable device charging for classes, emergency power, student travel accessory, meeting room device support, everyday device maintenance, extended work sessions, design studio power, technical demonstrations, remote learning support, and cross-campus productivity.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_category&sys_id=b805ea7fdb45cdd0ca10819b13961934&catalog_id=-1",
      locations: [
        "Cullinane: Red (lockers only): First-floor Student Collaboration Space",
      ],
      chips: ["Microsoft", "Surface"],
      image: `${BASE_URL}/images/surface_charger.jpg`,
    },
    {
      id: 6,
      name: "USB-C adapter",
      description:
        "Universal USB-C adapter for various devices. Includes HDMI, USB-A, and ethernet ports for comprehensive connectivity. Perfect for presentations and connecting to external displays or peripherals.",
      details:
        "Universal USB-C adapter for various devices. Includes HDMI, USB-A, and ethernet ports for comprehensive connectivity. Perfect for presentations and connecting to external displays or peripherals. This hub transforms a single USB-C port into multiple connection options, supporting simultaneous use of several peripherals at once. Provides 4K HDMI output at 60Hz, Gigabit Ethernet, SD/microSD card reading, and data transfer speeds up to 5Gbps. Extended Info: Also called a 'Type-C multiplexer', 'port expansion hub', or 'universal connector'; its use cases cover extending peripheral compatibility, linking to external monitors, integrating HDMI outputs, network connections in classrooms, multimedia presentations, lab equipment interfacing, portable connectivity in meetings, technical demonstrations, flexible device interfacing, seamless connectivity during events, multi-device integration, data transfer between different devices, camera and phone content access, presentation support across campus, and collaboration with mixed device environments.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_category&sys_id=b805ea7fdb45cdd0ca10819b13961934&catalog_id=-1",
      chips: ["USB-C", "Adapter"],
      image: `${BASE_URL}/images/USB_C_adapter.png`,
    },
    {
      id: 7,
      name: "USB-C charger",
      description:
        "For devices with USB-C charging ports. Fast charging at 100W with power delivery for laptops and mobile devices. Compact design with foldable prongs for easy portability between classes.",
      details:
        "For devices with USB-C charging ports. Fast charging at 100W with power delivery for laptops and mobile devices. Compact design with foldable prongs for easy portability between classes. Features intelligent power allocation when multiple devices are connected, prioritizing larger devices while ensuring efficient charging for all connected equipment. Includes short-circuit protection, over-current protection, and temperature control for safe operation. Extended Info: Also known as a 'Type-C charging unit', 'USB-C power delivery adapter', or 'USB-C power adapter'; useful for rapid device charging, sustained mobile power for on-the-go work, recharging laptops, emergency power-ups, travel charging convenience, classroom device maintenance, backup power for meetings, efficient presentation support, portable energy in labs, regular study session power, multi-device simultaneous charging, remote learning power solution, outdoor workstation setup, cross-campus productivity, and technology-centered group work.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_category&sys_id=b805ea7fdb45cdd0ca10819b13961934&catalog_id=-1",
      chips: ["USB-C", "Charging"],
      image: `${BASE_URL}/images/USB_C_charger.png`,
    },
  ],
  laptop: [
    {
      id: 8,
      name: "Apple Laptop",
      description:
        "MacBook available for temporary use. Various models with different specifications including Pro and Air variants with the latest macOS. Pre-installed with Adobe Creative Cloud, Microsoft Office, and other academic software.",
      details:
        "MacBook available for temporary use. Various models with different specifications including Pro and Air variants with the latest macOS. Pre-installed with Adobe Creative Cloud, Microsoft Office, and other academic software. These MacBooks come with high-resolution Retina displays, speedy SSD storage, and efficient processors designed for both intensive creative work and everyday academic tasks. All laptops undergo thorough sanitation and software resets between each user to ensure privacy and optimal performance. Extended Info: Also referred to as a 'MacBook notebook', 'Apple loaner', or 'Apple portable computer'; potential use cases include graphic design, video editing, programming, academic research, multimedia presentations, creative projects, digital art production, software development environments, classroom computing, on-the-go study sessions, virtual reality development, mobile app testing, music production, animation projects, architectural modeling, journalism field work, medical visualization, and scientific data analysis.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_cat_item&sys_id=2f56e607db41c1d0ca10819b13961914",
      chips: ["Apple", "MacOS"],
      image: `${BASE_URL}/images/apple_laptop.png`,
    },
    {
      id: 9,
      name: "Windows Laptop",
      description:
        "Windows laptop available for temporary use. Various models with different specifications including HP and Dell models with Windows 11. Perfect for engineering software, CAD programs, and other Windows-specific applications.",
      details:
        "Windows laptop available for temporary use. Various models with different specifications including HP and Dell models with Windows 11. Perfect for engineering software, CAD programs, and other Windows-specific applications. These laptops feature powerful processors, dedicated graphics capabilities, and expanded memory configurations optimized for computational tasks. Loan periods range from single-day use to multi-week assignments depending on project requirements and departmental approvals. Extended Info: Also known as a 'PC notebook', 'Windows loaner', or 'Windows portable computer'; practical for engineering simulations, CAD work, office productivity, software testing, document creation, multimedia editing, research data analysis, classroom assignments, interactive learning, digital presentations, specialized software compatibility, 3D modeling, statistical analysis, engineering calculations, business intelligence work, database management, game development testing, circuit design, and financial modeling.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_cat_item&sys_id=1ea42643dbc1c1d0ca10819b139619ca",
      chips: ["Windows", "Temporary Use"],
      image: `${BASE_URL}/images/win_laptop.jpg`,
    },
    {
      id: 10,
      name: "Microsoft Surface Laptop 3",
      description:
        "Laptop available for temporary use. Core i7 1.3 GHz, 16 GB RAM, 256 GB SSD with touch screen and stylus support. Ideal for digital note-taking, graphic design, and presentations. Includes detachable keyboard.",
      details:
        "Laptop available for temporary use. Core i7 1.3 GHz, 16 GB RAM, 256 GB SSD with touch screen and stylus support. Ideal for digital note-taking, graphic design, and presentations. Includes detachable keyboard. This versatile 2-in-1 device transitions seamlessly between laptop and tablet modes, offering flexibility for various academic and creative pursuits. The high-resolution PixelSense display provides accurate color reproduction for design work, while the long battery life supports full-day productivity without requiring constant charging. Extended Info: Also called a 'Surface notebook', 'Microsoft convertible', or 'Microsoft portable computer'; it can be used for digital notetaking, creative design, presentation delivery, mobile productivity, interactive learning, rapid brainstorming, lightweight computing tasks, flexible work sessions, academic project support, touchscreen-driven tasks, architectural sketching, mathematical equation input, visual arts projects, human-computer interaction research, hybrid teaching modes, annotating documents, collaborative diagram creation, on-site fieldwork documentation, and interactive data exploration.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_cat_item&sys_id=fc5f8615db769810a37cd206ca9619fa",
      chips: ["Microsoft", "Windows"],
      duration: "Up to 5 days",
      image: `${BASE_URL}/images/surface_laptop.png`,
    },
  ],
  accessories: [
    {
      id: 11,
      name: "InFocus projector",
      description:
        "Portable projector for presentations. Supports HDMI and wireless connections with 1080p resolution and built-in speaker. Battery-powered option allows use in locations without power outlets.",
      details:
        "Portable projector for presentations. Supports HDMI and wireless connections with 1080p resolution and built-in speaker. Battery-powered option allows use in locations without power outlets. The lightweight, compact design (under 3 pounds) makes it highly portable across campus, while the intuitive interface requires minimal setup time. Features include automatic keystone correction, screen mirroring capabilities, and compatibility with mobile devices through dedicated apps. Extended Info: Also known as a 'portable projection system', 'mobile projector', or 'visual display unit'; useful in conference presentations, academic lectures, dynamic event demonstrations, multimedia displays, collaborative meetings, digital signage, classroom teachings, group seminars, business briefings, interactive workshops, outdoor movie nights, data visualization sessions, pitch competitions, impromptu project reviews, student organization events, recruitment activities, design critiques, and temporary information displays.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_cat_item&sys_id=77afd545972c6110beddb4221153af7c",
      chips: ["Presentation", "Portable"],
      image: `${BASE_URL}/images/infocus_projector.jpeg`,
    },
    {
      id: 12,
      name: "Microscopes",
      description:
        "Various microscopes available for academic use. Digital and optical options with magnification from 40x to 1000x. USB connection allows direct capture to your computer for lab reports and research documentation.",
      details:
        "Various microscopes available for academic use. Digital and optical options with magnification from 40x to 1000x. USB connection allows direct capture to your computer for lab reports and research documentation. The collection includes compound microscopes for cellular examination, stereomicroscopes for 3D specimen viewing, and specialized phase contrast models for transparent biological samples. Software provided with digital models enables measurement, annotation, and time-lapse photography for comprehensive analysis. Extended Info: Also referred to as 'optical magnifiers', 'specimen viewers', or 'digital microscopes'; can be applied for biological research, lab experiments, classroom demonstrations, scientific specimen analysis, digital imaging, interactive study sessions, research documentation, quality inspection, experimental learning, detailed visual examinations, microorganism identification, cellular structure analysis, material science investigations, forensic sample examination, environmental contaminant assessment, medical education, crystallography, textile fiber analysis, and nanomaterial visualization.",
      navigateTo: "https://cils.northeastern.edu/facilities/",
      chips: ["Lab", "Research"],
      image: `${BASE_URL}/images/microscope.png`,
    },
    {
      id: 3,
      name: "Laptop power bank",
      description:
        "Available at International Village Basement and EXP floors. Provides up to 8 hours of charge for most laptop models. Compatible with most major brands including Apple, Dell, and Lenovo devices.",
      details:
        "Available at International Village Basement and EXP floors. Provides up to 8 hours of charge for most laptop models. Compatible with most major brands including Apple, Dell, and Lenovo devices. These high-capacity power banks feature multiple output ports (USB-C, USB-A) with fast-charging capabilities and LED indicators showing remaining power levels. Loan periods typically last 24 hours with potential for renewal if demand allows. Extended Info: Also known as 'portable battery pack', 'mobile power station', or 'laptop battery booster'; use cases include in-class recharging, mobile workstations, emergency power supply, extended study sessions, outdoor presentations, backup power during events, travel-ready power, on-the-go device support, temporary charging in labs, quick power-ups between sessions, powering devices during campus outages, fieldwork support, multi-day conferences, outdoor study groups, and collaborative work in non-traditional spaces.",
      locations: [
        "International Village Basement",
        "Second floor of EXP next to the student printers",
        "Third floor of EXP next to the student printers",
      ],
      navigateTo:
        "https://service.northeastern.edu/tech?id=kb_article&sysparm_article=KB000018991",
      chips: ["Power", "Charging", "Portable"],
      image: `${BASE_URL}/images/laptop_PB.png`,
    },
  ],
  camera: [
    {
      id: 18,
      name: "Canon EOS Camera",
      description:
        "Capture high-quality images and videos with this versatile DSLR camera.",
      details:
        "Ideal for photography and videography projects, the Canon EOS Camera offers manual controls, interchangeable lenses, and high-resolution imaging capabilities. This professional-grade DSLR features a large APS-C sensor for exceptional image quality, advanced autofocus system with eye-tracking technology, and 4K video recording capabilities. The camera includes multiple custom shooting modes, RAW file support, and compatibility with Canon's extensive lens ecosystem for maximum creative flexibility. Extended Info: Also known as a 'Canon DSLR', 'professional camera', or 'digital SLR'; suitable for professional photography, portrait sessions, sports documentation, landscape photography, product shoots, documentary filmmaking, photojournalism, wildlife observation, architectural photography, fashion shoots, event coverage, wedding photography, time-lapse creation, nighttime astronomy, macro photography, street photography, fine art creation, campus newspaper work, and marketing material development.",
      navigateTo: "https://northeastern.libcal.com/equipment/item/9589",
      chips: ["Canon", "Camera", "MediaRecorder"],
      image: `${BASE_URL}/images/sony_EOS.jpeg`,
    },
    {
      id: 13,
      name: "Ricoh Theta",
      description:
        "360-degree camera for immersive photography. Creates panoramic images and videos for virtual reality applications. Perfect for architectural documentation, event coverage, and interactive media projects.",
      details:
        "360-degree camera for immersive photography. Creates panoramic images and videos for virtual reality applications. Perfect for architectural documentation, event coverage, and interactive media projects. This specialized camera captures a complete spherical image with no blind spots, utilizing dual ultra-wide-angle lenses that automatically stitch content together. Features include 4K video recording, spatial audio capture, live streaming capabilities, and smartphone control through a dedicated app. Extended Info: Also known as a '360° panoramic camera', 'spherical imaging device', or 'omnidirectional recorder'; suitable for immersive photography, virtual tour creation, environmental mapping, event documentation, creative storytelling, site surveys, interactive media production, digital panoramas, VR content capture, artistic photography, real estate visualization, cultural heritage documentation, remote location monitoring, educational virtual field trips, experimental filmmaking, interactive exhibits, spatial analysis, event marketing, and immersive journalism.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_cat_item&sys_id=670f0615db769810a37cd206ca961965",
      chips: ["360°", "Photography"],
      image: `${BASE_URL}/images/ricoh_theta.jpg`,
    },
    {
      id: 14,
      name: "Sony HandyCam",
      description:
        "HD video camera for recording. Professional-grade with 20x optical zoom and external microphone support. Stabilization technology ensures smooth footage even when recording while walking or moving.",
      details:
        "HD video camera for recording. Professional-grade with 20x optical zoom and external microphone support. Stabilization technology ensures smooth footage even when recording while walking or moving. Features include high-quality Carl Zeiss optics, various shooting modes for different lighting situations, and dual memory card slots for extended recording capacity. Advanced audio options include wind noise reduction, zoom microphone functionality, and 5.1 channel surround sound recording for immersive playback. Extended Info: Also called an 'HD camcorder', 'video recorder', or 'portable video recorder'; well-suited for event recording, professional media production, field reporting, digital journalism, video blogging, academic documentation, creative film-making, live event coverage, dynamic filming in motion, quality recording, sports performance analysis, interview sessions, documentary creation, performance documentation, social science research, ethnographic studies, instructional videos, presentation recordings, and behavioral observations.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_cat_item&sys_id=d5910dc8dbbe1410a37cd206ca96190e",
      chips: ["Video", "Recording"],
      image: `${BASE_URL}/images/sony_cam.png`,
    },
    {
      id: 15,
      name: "Samsung 360",
      description:
        "360-degree camera for virtual reality content. Waterproof design with 4K video capture and spatial audio recording. Compatible with most VR headsets and platforms for immersive project presentations.",
      details:
        "360-degree camera for virtual reality content. Waterproof design with 4K video capture and spatial audio recording. Compatible with most VR headsets and platforms for immersive project presentations. Designed with six built-in microphones for directional audio that changes as the viewer's perspective shifts within the VR environment. The durable construction is shock-resistant, dust-proof, and submersible up to 5 meters, making it suitable for field research in various environments. Extended Info: Also known as a '360° VR camera', 'immersive capture device', or 'immersive video recorder'; use cases include VR content creation, panoramic videography, creative multimedia projects, underwater photography, professional filming, interactive media presentations, immersive documentation, spatial audio recording, dynamic event capture, innovative video production, adventure sport documentation, marine research, architecture visualization, clinical psychology applications, engineering site documentation, archaeological recording, museum exhibit development, accessibility simulations, and experiential marketing.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_cat_item&sys_id=20f5c100dbfe1410a37cd206ca961913",
      chips: ["360°", "VR"],
      image: `${BASE_URL}/images/samsung_360.png`,
    },
    {
      id: 19,
      name: "Panasonic Camera",
      description:
        "Record professional-grade videos with this high-definition Panasonic camera.",
      details:
        "Suitable for various recording needs, this Panasonic camera provides excellent video quality and user-friendly features for both beginners and professionals. The camera incorporates built-in image stabilization for smooth handheld recording, high dynamic range for balanced exposure in challenging lighting, and high-frame-rate options for slow-motion effects. Audio features include XLR inputs for professional microphones, manual audio level controls, and headphone monitoring capabilities for precise sound capture. Extended Info: Also known as a 'Panasonic video camera', 'professional camcorder', or 'broadcast-quality recorder'; appropriate for documentary projects, interview recording, live event coverage, promotional video creation, instructional content, performance documentation, news gathering, social media content creation, corporate video production, sports analysis, film student projects, independent filmmaking, video essays, travel documentation, theatrical recording, case study visualization, experimental video art, ethnographic research, and process demonstration.",
      navigateTo: ["https://northeastern.libcal.com/equipment/item/12059"],
      chips: ["Panasonic", "Camera", "MediaRecorder"],
      image: `${BASE_URL}/images/panasonic_cam.png`,
    },
    // {
    //   id: 19,
    //   name: "Panasonic Camera",
    //   description: "Record professional-grade videos with this high-definition Panasonic camera.",
    //   details: "Suitable for various recording needs, this Panasonic camera provides excellent video quality and user-friendly features for both beginners and professionals. The camera incorporates built-in image stabilization for smooth handheld recording, high dynamic range for balanced exposure in challenging lighting, and high-frame-rate options for slow-motion effects. Audio features include XLR inputs for professional microphones, manual audio level controls, and headphone monitoring capabilities for precise sound capture. Extended Info: Also known as a 'Panasonic video camera', 'professional camcorder', or 'broadcast-quality recorder'; appropriate for documentary projects, interview recording, live event coverage, promotional video creation, instructional content, performance documentation, news gathering, social media content creation, corporate video production, sports analysis, film student projects, independent filmmaking, video essays, travel documentation, theatrical recording, case study visualization, experimental video art, ethnographic research, and process demonstration.",
    //   navigateTo: ["https://northeastern.libcal.com/equipment/item/12059"],
    //   chips: ["Panasonic", "Camera","MediaRecorder"],
    //   image: `${BASE_URL}/images/panasonic_cam.png`,
    // },
  ],
  microphone: [
    {
      id: 21,
      name: "Zoom H4N Pro",
      description:
        "Professional 4-track audio recorder with built-in X/Y microphones.",
      details:
        "The Zoom H4N Pro offers high-fidelity audio recording with advanced features like overdubbing, effects, and multiple recording modes, making it ideal for musicians and filmmakers. This field recorder captures pristine 24-bit/96kHz audio with extremely low noise floor and provides phantom power for professional condenser microphones. Multiple recording formats including WAV and MP3 allow flexibility for different project requirements, while the rugged construction withstands outdoor recording conditions. Extended Info: Also referred to as an 'audio field recorder', 'multi-track sound device', or 'portable studio'; ideal for film sound recording, music performance capture, podcast production, ambient sound collection, voice-over recording, sound design, foley creation, band rehearsal documentation, interview recording, lecture capture, environmental sound research, audio storytelling, sound effect gathering, on-location production audio, concert recording, oral history projects, sound mixing, acoustic analysis, and radio journalism.",
      navigateTo: "https://northeastern.libcal.com/equipment/item/53062",
      chips: ["Audio", "Recording"],
      image: `${BASE_URL}/images/zoh_microphone.jpg`,
    },
    {
      id: 22,
      name: "Recording Kit",
      description:
        "Comprehensive kit for high-quality audio recording sessions.",
      details:
        "Includes essential equipment such as microphones, headphones, and audio interfaces, perfect for capturing clear and professional sound in various settings. The complete kit contains condenser and dynamic microphones with stands, closed-back monitoring headphones, pop filters, shock mounts, an audio interface with multiple inputs, and all necessary cables and adapters. Setup instructions and basic recording techniques are included for users new to audio production. Extended Info: Also known as an 'audio production package', 'sound recording bundle', or 'professional audio kit'; applicable for podcast recording, interview sessions, voice-over production, music demos, dialogue capture, audiobook narration, radio drama creation, livestream audio, conference recordings, focus group documentation, singing practice, instrument recording, sound effect creation, language learning exercises, speech therapy documentation, audio for video production, distance learning content, research interviews, and acoustic performances.",
      navigateTo: "https://northeastern.libcal.com/equipment/item/101060",
      chips: ["Recording Kit", "Audio", "Recording"],
      image: `${BASE_URL}/images/record_kit.jpg`,
    },
    {
      id: 25,
      name: "Podcasting Kit",
      description:
        "All-in-one kit designed for podcast creation and broadcasting.",
      details:
        "Equipped with a condenser microphone, audio interface, and other accessories, this kit provides everything needed to produce high-quality podcasts. Includes multiple broadcast-quality microphones, a multi-channel mixer with USB output, studio-grade headphones for monitoring, adjustable boom arms, acoustic treatment panels, pop filters, and comprehensive cabling. The included software bundle features audio editing tools, sound effect libraries, and royalty-free music beds to enhance production quality. Extended Info: Also known as a 'broadcast package', 'podcast studio', or 'digital broadcasting kit'; suitable for podcast production, interview series, radio show creation, remote broadcasting, panel discussions, educational content development, narrative storytelling, commentary recording, talk show production, audio blog creation, community radio projects, current affairs programming, debate recording, audio newsletters, club announcements, speech practice, roundtable discussions, guest lecture distribution, and student journalism projects.",
      navigateTo: "https://northeastern.libcal.com/equipment/item/53065",
      chips: ["Podcasting Kit", "Audio", "Recording"],
      image: `${BASE_URL}/images/podcast_kit.jpeg`,
    },
    {
      id: 17,
      name: "Voice recorder",
      description:
        "Digital recorder for lectures and interviews. High-quality mic with noise cancellation and 32GB storage. Automatic transcription services available through Husky account integration.",
      details:
        "Digital recorder for lectures and interviews. High-quality mic with noise cancellation and 32GB storage. Automatic transcription services available through Husky account integration. Features include variable playback speed without pitch distortion, mark and jump functionality for key moments, and directional recording options to focus on specific sound sources. The rechargeable battery provides up to 40 hours of continuous recording, while USB connectivity enables quick file transfers to computers for backup and sharing. Extended Info: Also known as an 'audio recorder', 'digital dictation device', or 'sound capture device'; practical for lecture recordings, interview documentation, meeting minutes, field recordings, podcast creation, academic note-taking, voice memo capture, group discussion recording, transcription-based research, oral presentations, language learning practice, music composition, journalism field work, speech analysis, audio diary keeping, verbal research data collection, sound effect gathering, accessibility accommodations, and qualitative research interviews.",
      navigateTo: "https://northeastern.libcal.com/equipment/item/42345",
      locations: [
        "Cullinane: Red (lockers only): First-floor Student Collaboration Space",
      ],
      chips: ["Audio", "Recording"],
      image: `${BASE_URL}/images/microphone.jpg`,
    },
  ],
  "vending accessories": [
    {
      id: 16,
      name: "Bluetooth presenter",
      description:
        "Wireless presenter for slideshows. Includes laser pointer and programmable buttons with 30ft range. No setup required - plug and play with any computer for immediate presentation control.",
      details:
        "Wireless presenter for slideshows. Includes laser pointer and programmable buttons with 30ft range. No setup required - plug and play with any computer for immediate presentation control. The ergonomic design fits comfortably in hand for extended use, while the intuitive button layout allows for blind operation without looking at the device. Advanced models feature mouse functionality, volume control, and screen blackout options for maximum presentation flexibility. Extended Info: Also referred to as a 'wireless presentation remote', 'slide controller', or 'presentation clicker'; ideal for advancing slides, lecture navigation, business meeting facilitation, conference presentation control, classroom teaching, seminar guidance, training session coordination, public speaking aid, digital presentation management, interactive sessions, thesis defenses, sales pitches, keynote addresses, guest lectures, research presentations, student project demonstrations, professional development sessions, and distance education lectures.",
      navigateTo:
        "https://service.northeastern.edu/tech?id=sc_category&sys_id=b805ea7fdb45cdd0ca10819b13961934&catalog_id=-1",
      locations: [
        "Snell Library: Blue, Green, Orange: The Hub, near the front entrance",
      ],
      chips: ["Presentation", "Wireless"],
      image: `${BASE_URL}/images/bluetooth_presenter.jpg`,
    },
    // {
    //   id: 17,
    //   name: "Voice recorder",
    //   description:
    //     "Digital recorder for lectures and interviews. High-quality mic with noise cancellation and 32GB storage. Automatic transcription services available through Husky account integration.",
    //   details:
    //     "Digital recorder for lectures and interviews. High-quality mic with noise cancellation and 32GB storage. Automatic transcription services available through Husky account integration. Features include variable playback speed without pitch distortion, mark and jump functionality for key moments, and directional recording options to focus on specific sound sources. The rechargeable battery provides up to 40 hours of continuous recording, while USB connectivity enables quick file transfers to computers for backup and sharing. Extended Info: Also known as an 'audio recorder', 'digital dictation device', or 'sound capture device'; practical for lecture recordings, interview documentation, meeting minutes, field recordings, podcast creation, academic note-taking, voice memo capture, group discussion recording, transcription-based research, oral presentations, language learning practice, music composition, journalism field work, speech analysis, audio diary keeping, verbal research data collection, sound effect gathering, accessibility accommodations, and qualitative research interviews.",
    //   navigateTo: "https://northeastern.libcal.com/reserve/videoequipment",
    //   locations: [
    //     "Cullinane: Red (lockers only): First-floor Student Collaboration Space",
    //   ],
    //   chips: ["Audio", "Recording"],
    //   image: `${BASE_URL}/images/microphone.jpg`,
    // },
    // {
    //   id: 18,
    //   name: "Canon EOS Camera",
    //   description: "Capture high-quality images and videos with this versatile DSLR camera.",
    //   details: "Ideal for photography and videography projects, the Canon EOS Camera offers manual controls, interchangeable lenses, and high-resolution imaging capabilities. This professional-grade DSLR features a large APS-C sensor for exceptional image quality, advanced autofocus system with eye-tracking technology, and 4K video recording capabilities. The camera includes multiple custom shooting modes, RAW file support, and compatibility with Canon's extensive lens ecosystem for maximum creative flexibility. Extended Info: Also known as a 'Canon DSLR', 'professional camera', or 'digital SLR'; suitable for professional photography, portrait sessions, sports documentation, landscape photography, product shoots, documentary filmmaking, photojournalism, wildlife observation, architectural photography, fashion shoots, event coverage, wedding photography, time-lapse creation, nighttime astronomy, macro photography, street photography, fine art creation, campus newspaper work, and marketing material development.",
    //   navigateTo: "https://northeastern.libcal.com/equipment/item/9589",
    //   chips: ["Canon","Camera","MediaRecorder"],
    //   image: `${BASE_URL}/images/sony_EOS.jpeg`,
    // },
    // {
    //   id: 19,
    //   name: "Panasonic Camera",
    //   description: "Record professional-grade videos with this high-definition Panasonic camera.",
    //   details: "Suitable for various recording needs, this Panasonic camera provides excellent video quality and user-friendly features for both beginners and professionals. The camera incorporates built-in image stabilization for smooth handheld recording, high dynamic range for balanced exposure in challenging lighting, and high-frame-rate options for slow-motion effects. Audio features include XLR inputs for professional microphones, manual audio level controls, and headphone monitoring capabilities for precise sound capture. Extended Info: Also known as a 'Panasonic video camera', 'professional camcorder', or 'broadcast-quality recorder'; appropriate for documentary projects, interview recording, live event coverage, promotional video creation, instructional content, performance documentation, news gathering, social media content creation, corporate video production, sports analysis, film student projects, independent filmmaking, video essays, travel documentation, theatrical recording, case study visualization, experimental video art, ethnographic research, and process demonstration.",
    //   navigateTo: ["https://northeastern.libcal.com/equipment/item/12059"],
    //   chips: ["Panasonic", "Camera","MediaRecorder"],
    //   image: `${BASE_URL}/images/panasonic_cam.png`,
    // },
    {
      id: 20,
      name: "Tripod",
      description:
        "Sturdy tripod to stabilize your camera or recording device.",
      details:
        "Enhance your photography and videography by using this adjustable tripod, ensuring steady shots and reducing camera shake during shoots. This professional-grade aluminum tripod features adjustable height settings from 18 to 65 inches, quick-release plate for rapid camera mounting, bubble level indicators for precise horizontal alignment, and fluid pan-tilt head for smooth camera movements. The collapsible design with carrying case enables easy transportation across campus and to remote shooting locations. Extended Info: Also known as a 'camera stand', 'stabilization mount', or 'three-legged support'; useful for long exposure photography, interview setups, product photography, self-portrait capture, time-lapse creation, video blogging, low-light shooting, group photos, precise framing, panoramic image creation, documentary filming, livestreaming setups, wildlife observation, architectural documentation, remote trigger shooting, multi-angle coverage, stable macro photography, presentation recording, and professional portraiture.",
      navigateTo: "https://northeastern.libcal.com/equipment/item/12493",
      chips: ["Stand", "Tripod"],
      image: `${BASE_URL}/images/tripod.jpg`,
    },
    // {
    //   id: 21,
    //   name: "Zoom H4N Pro",
    //   description: "Professional 4-track audio recorder with built-in X/Y microphones.",
    //   details: "The Zoom H4N Pro offers high-fidelity audio recording with advanced features like overdubbing, effects, and multiple recording modes, making it ideal for musicians and filmmakers. This field recorder captures pristine 24-bit/96kHz audio with extremely low noise floor and provides phantom power for professional condenser microphones. Multiple recording formats including WAV and MP3 allow flexibility for different project requirements, while the rugged construction withstands outdoor recording conditions. Extended Info: Also referred to as an 'audio field recorder', 'multi-track sound device', or 'portable studio'; ideal for film sound recording, music performance capture, podcast production, ambient sound collection, voice-over recording, sound design, foley creation, band rehearsal documentation, interview recording, lecture capture, environmental sound research, audio storytelling, sound effect gathering, on-location production audio, concert recording, oral history projects, sound mixing, acoustic analysis, and radio journalism.",
    //   navigateTo: "https://northeastern.libcal.com/equipment/item/53062",
    //   chips: ["Audio", "Recording"],
    //   image: `${BASE_URL}/images/zoh_microphone.jpg`,
    // },
    // {
    //   id: 22,
    //   name: "Recording Kit",
    //   description: "Comprehensive kit for high-quality audio recording sessions.",
    //   details: "Includes essential equipment such as microphones, headphones, and audio interfaces, perfect for capturing clear and professional sound in various settings. The complete kit contains condenser and dynamic microphones with stands, closed-back monitoring headphones, pop filters, shock mounts, an audio interface with multiple inputs, and all necessary cables and adapters. Setup instructions and basic recording techniques are included for users new to audio production. Extended Info: Also known as an 'audio production package', 'sound recording bundle', or 'professional audio kit'; applicable for podcast recording, interview sessions, voice-over production, music demos, dialogue capture, audiobook narration, radio drama creation, livestream audio, conference recordings, focus group documentation, singing practice, instrument recording, sound effect creation, language learning exercises, speech therapy documentation, audio for video production, distance learning content, research interviews, and acoustic performances.",
    //   navigateTo: "https://northeastern.libcal.com/equipment/item/101060",
    //   chips: ["Recording Kit", "Audio", "Recording"],
    //   image: `${BASE_URL}/images/record_kit.jpg`,
    // },
    // {
    //   id: 25,
    //   name: "Podcasting Kit",
    //   description: "All-in-one kit designed for podcast creation and broadcasting.",
    //   details: "Equipped with a condenser microphone, audio interface, and other accessories, this kit provides everything needed to produce high-quality podcasts. Includes multiple broadcast-quality microphones, a multi-channel mixer with USB output, studio-grade headphones for monitoring, adjustable boom arms, acoustic treatment panels, pop filters, and comprehensive cabling. The included software bundle features audio editing tools, sound effect libraries, and royalty-free music beds to enhance production quality. Extended Info: Also known as a 'broadcast package', 'podcast studio', or 'digital broadcasting kit'; suitable for podcast production, interview series, radio show creation, remote broadcasting, panel discussions, educational content development, narrative storytelling, commentary recording, talk show production, audio blog creation, community radio projects, current affairs programming, debate recording, audio newsletters, club announcements, speech practice, roundtable discussions, guest lecture distribution, and student journalism projects.",
    //   navigateTo: "https://northeastern.libcal.com/equipment/item/101060",
    //   chips: ["Podcasting Kit", "Audio", "Recording"],
    //   image: `${BASE_URL}/images/podcast_kit.jpeg`,
    // },
  ],
  "working with gpus": [
    {
      id: 23,
      name: "HPC (High Powered Computing) GPU Access",
      description:
        "Access to high-performance computing resources with GPU capabilities. Includes NVIDIA A100 and V100 GPUs for machine learning applications. Priority access available for research and capstone projects.",
      details:
        "Access to high-performance computing resources with GPU capabilities. Includes NVIDIA A100 and V100 GPUs for machine learning applications. Priority access available for research and capstone projects. The university's HPC cluster features hundreds of compute cores, terabytes of RAM, and petabytes of storage with high-speed InfiniBand interconnects for maximum performance. Available software includes CUDA development tools, TensorFlow, PyTorch, and specialized scientific computing packages with dedicated technical support for implementation assistance. Extended Info: Also called 'High Performance GPU Access', 'Research Computing Resources', or 'Advanced GPU computing resource'; use cases encompass machine learning training, deep learning research, AI model development, scientific computing, high-end data processing, simulation and rendering tasks, complex algorithm training, computational fluid dynamics, visual effects processing, academic research in AI, neural network experimentation, big data analytics, genomic sequencing, molecular modeling, climate simulation, particle physics calculation, financial modeling, and natural language processing development.",
      navigateTo: "https://rc-docs.northeastern.edu/en/latest/index.html",
      chips: ["HPC", "GPU"],
      image: `${BASE_URL}/images/gpu.jpg`,
    },
    {
      id: 24,
      name: "Cluster Job Submission",
      description:
        "Submit computational jobs to the university's computing cluster. Supports TensorFlow, PyTorch and other frameworks with priority scheduling. Includes containerization support for reproducible research environments.",
      details:
        "Submit computational jobs to the university's computing cluster. Supports TensorFlow, PyTorch and other frameworks with priority scheduling. Includes containerization support for reproducible research environments. The job management system offers queue prioritization based on academic requirements, usage monitoring tools, and scheduling options for optimal resource allocation. Users can utilize pre-configured containers with common research environments or create custom configurations to match specific computational requirements. Extended Info: Also known as 'Computational cluster submission', 'HPC job scheduling', or 'distributed computing job entry'; applicable for scientific computing tasks, big data processing, high-performance algorithm testing, simulation runs, machine learning workloads, research project computations, distributed processing, programming competitions, academic data analysis, scalable research operations, parameter sweep experiments, physics simulations, bioinformatics processing, statistical modeling, graphics rendering farms, neural network optimization, large-scale data mining, genomic analysis, and mathematical model validation.",
      navigateTo:
        "https://rc-docs.northeastern.edu/en/latest/runningjobs/index.html",
      chips: ["Computing", "Research"],
      image: `${BASE_URL}/images/cluster.png`,
    },
  ],
};

module.exports = resourcesData;
