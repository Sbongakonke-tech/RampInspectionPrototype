const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbxYOcWPvNXO49ZZfOv2zteecBh37ZnO3ez9CnyXOJsn041nZZ8zWRPBBcjid7Ahbt5t2A/exec';
let totalTurnarounds = 0;
let onTimeTurnarounds = 0;
const TARGET_TURNAROUND = 45;
const checklistScreen =
document.getElementById("checklistScreen");

const backInbound =
document.getElementById("backInbound");
const toast = document.getElementById("toast");
const inboundScreen = document.getElementById("inboundScreen");

const backFlight = document.getElementById("backFlight");
const homeScreen = document.getElementById("homeScreen");
const flightScreen = document.getElementById("flightScreen");

const startInspection = document.getElementById("startInspection");
const backHome = document.getElementById("backHome");

const inspectionScreen = document.getElementById("inspectionScreen");
const backChecklist = document.getElementById("backChecklist");
const fodItem = document.getElementById("fodItem");

const saveInspection = document.getElementById("saveInspection");
const fodLabel = document.getElementById("fodLabel");
const checklistProgress = document.getElementById("checklistProgress");
const checklistFill = document.getElementById("checklistFill");
const chocksItem = document.getElementById("chocksItem");
const chocksLabel = document.getElementById("chocksLabel");

const conesItem = document.getElementById("conesItem");
const conesLabel = document.getElementById("conesLabel");

const gpuItem = document.getElementById("gpuItem");
const gpuLabel = document.getElementById("gpuLabel");

const stairsItem = document.getElementById("stairsItem");
const stairsLabel = document.getElementById("stairsLabel");

const addPhoto = document.getElementById("addPhoto");
const photoStatus = document.getElementById("photoStatus");

const summaryScreen = document.getElementById("summaryScreen");

const backToChecklist =
document.getElementById("backToChecklist");

const reviewInspection =
document.getElementById("reviewInspection");

const successScreen = document.getElementById("successScreen");

const successReference = document.getElementById("successReference");

const newInspection = document.getElementById("newInspection");

const returnHome = document.getElementById("returnHome");

const submitInspection = document.getElementById("submitInspection");
submitInspection.addEventListener("click", () => {

    const now = new Date();
    const reference =
        "SAA-" +
        now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        "-" +
        Math.floor(Math.random() * 900 + 100);

    successReference.textContent = reference;

    const chocked = document.getElementById("chocked").value;
    const thumbsUp = document.getElementById("thumbsUp").value;

    if (chocked && thumbsUp) {
        const start = new Date("2000-01-01T" + chocked);
        const end = new Date("2000-01-01T" + thumbsUp);
        const turnaroundMinutes = (end - start) / 60000;
        totalTurnarounds++;
        if (turnaroundMinutes <= TARGET_TURNAROUND) {
            onTimeTurnarounds++;
        }
        const rate = Math.round((onTimeTurnarounds / totalTurnarounds) * 100);
        document.getElementById("onTimeRate").textContent = rate + "%";
    }

    // Collect checklist items
    const items = Object.values(checklistItems).map(item => ({
        name: item.label || '',
        status: item.status || 'pending',
        comment: item.comments || '',
        completedTime: item.completedTime || ''
    }));

    // Build payload
    const payload = {
        flightNumber: document.getElementById('flightNumber')?.value || '',
        flightDate: document.getElementById('flightDate')?.value || '',
        bay: document.getElementById('parkingBay')?.value || '',
        coordinator: document.getElementById('coordinator')?.value || '',
        acType: document.getElementById('aircraftType')?.value || '',
        registration: document.getElementById('registration')?.value || '',
        sta: document.getElementById('sta')?.value || '',
        eta: document.getElementById('eta')?.value || '',
        ata: document.getElementById('ata')?.value || '',
        chockedTime: chocked,
        thumbsUp: thumbsUp,
        fod: document.getElementById('fod')?.value || '',
        status: document.getElementById('overallResult')?.textContent || '',
        itemsCompleted: items.filter(i => i.status === 'Pass').length,
        elapsedSeconds: chocked && thumbsUp ?
            Math.round((new Date("2000-01-01T" + thumbsUp) - new Date("2000-01-01T" + chocked)) / 1000) : 0,
        submittedBy: reference,
        items: JSON.stringify(items)
    };

    // Send to Google Sheets - fire and forget
    fetch(SHEETS_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(error => console.error('Sheets error:', error));

    // Move to success screen immediately
    summaryScreen.classList.add("hidden");
    successScreen.classList.remove("hidden");
    showToast("Inspection submitted successfully!", "success");
});

const checklistItems = {

    fod: {
        label: "Bay Clear of FOD",
        item: document.getElementById("fodItem"),
        text: document.getElementById("fodLabel"),
        completed: false,
        status: "",
        comments: "",
        completedTime: ""
    },

    chocks: {
        label: "Chocks Positioned",
        item: document.getElementById("chocksItem"),
        text: document.getElementById("chocksLabel"),
        completed: false,
        status: "",
        comments: "",
        completedTime: ""
    },

    cones: {
        label: "Safety Cones Positioned",
        item: document.getElementById("conesItem"),
        text: document.getElementById("conesLabel"),
        completed: false,
        status: "",
        comments: "",
        completedTime: ""
    },

    gpu: {
        label: "Ground Power Connected",
        item: document.getElementById("gpuItem"),
        text: document.getElementById("gpuLabel"),
        completed: false,
        status: "",
        comments: "",
        completedTime: ""
    },

    stairs: {
        label: "Passenger Stairs Positioned",
        item: document.getElementById("stairsItem"),
        text: document.getElementById("stairsLabel"),
        completed: false,
        status: "",
        comments: "",
        completedTime: ""
    }

};

let completedChecks = 0;
let currentInspection = "";

const inspectionStatus = {
    fod: false,
    chocks: false,
    cones: false,
    gpu: false,
    stairs: false
};

const aircraftRegistrations = {

    "A319": [
        "ZSSFA",
        "ZSSFB",
        "ZSSFC"
    ],

    "A320": [
        "ZSSZN",
        "ZSSZE",
        "ZSSZI",
        "ZSSZH", 
        "ZSSZG",
        "ZSSZA",
        "ZSSZK"
    ],

    "A330": [
        "ZSSXM",
        "ZSSXJ"
    ],

    "A340": [
        "ZSSXF",
        "ZSSXD"
    ],

    "B737": [
        "ZSBFA",
        "ZSBFB"
    ]

};

const aircraftType = document.getElementById("aircraftType");
const registration = document.getElementById("registration");

aircraftType.addEventListener("change", () => {

    registration.innerHTML =
        '<option value="">Select Registration</option>';

    const selectedAircraft = aircraftType.value;

    if (!selectedAircraft || !aircraftRegistrations[selectedAircraft]) {
    return;
}

aircraftRegistrations[selectedAircraft].forEach(reg => {

        const option = document.createElement("option");

        option.value = reg;
        option.textContent = reg;

        registration.appendChild(option);

    });

});

startInspection.addEventListener("click", () => {

    homeScreen.classList.add("hidden");
    flightScreen.classList.remove("hidden");

});

backHome.addEventListener("click", () => {

    flightScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");

});

backFlight.addEventListener("click", () => {

    inboundScreen.classList.add("hidden");
    flightScreen.classList.remove("hidden");

});

backInbound.addEventListener("click", () => {

    checklistScreen.classList.add("hidden");
    inboundScreen.classList.remove("hidden");

});

fodItem.addEventListener("click", () => {

    openInspection("fod");

});

chocksItem.addEventListener("click", () => {

    openInspection("chocks");

});

conesItem.addEventListener("click", () => {

    openInspection("cones");

});

gpuItem.addEventListener("click", () => {

    openInspection("gpu");

});

stairsItem.addEventListener("click", () => {

    openInspection("stairs");

});

backChecklist.addEventListener("click", () => {

    inspectionScreen.classList.add("hidden");
    checklistScreen.classList.remove("hidden");

}); 

backToChecklist.addEventListener("click", () => {

    alert("Back button clicked!");

    summaryScreen.classList.add("hidden");
    checklistScreen.classList.remove("hidden");

});

returnHome.addEventListener("click", () => {

    successScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");

});

newInspection.addEventListener("click", () => {

    successScreen.classList.add("hidden");
    flightScreen.classList.remove("hidden");

});

addPhoto.addEventListener("click", () => {

    photoStatus.textContent =
        "📷 Photo attached (Prototype)";

    showToast("Photo added.", "success");

}); 

reviewInspection.addEventListener("click", () => {
if (completedChecks < 5) {

    showToast(
        "Complete all checklist items before reviewing.",
        "error"
    );

    return;

}
    // Flight information
    document.getElementById("summaryFlight").textContent =
        document.getElementById("flightNumber").value;

    document.getElementById("summaryAircraft").textContent =
        document.getElementById("aircraftType").value;

    document.getElementById("summaryRegistration").textContent =
        document.getElementById("registration").value;

    // Checklist results
    const summaryChecks =
        document.getElementById("summaryChecks");

    summaryChecks.innerHTML = "";

    Object.values(checklistItems).forEach(item => {

        const row = document.createElement("div");

        row.className = "summaryItem";

        row.innerHTML = `
            <strong>${item.label}</strong><br>
            Status: ${item.status || "Not Completed"}<br>
            Time: ${item.completedTime || "-"}<br>
            Comments: ${item.comments || "None"}
        `;

        summaryChecks.appendChild(row);

    });
const overallResult =
document.getElementById("overallResult");

const hasFailure =
Object.values(checklistItems)
.some(item => item.status === "Fail");

if(hasFailure){

    overallResult.textContent = "❌ FAIL";

    overallResult.className =
        "resultCard resultFail";

}
else{

    overallResult.textContent = "✅ PASS";

    overallResult.className =
        "resultCard resultPass";

}

    checklistScreen.classList.add("hidden");
    summaryScreen.classList.remove("hidden");

});
saveInspection.addEventListener("click", () => {

    // Get the current checklist item
    const item = checklistItems[currentInspection];

    // Get selected status
    const selectedStatus =
        document.querySelector('input[name="status"]:checked');

    if (!selectedStatus) {

        showToast("Please select Pass, Fail or N/A.", "error");
        return;

    }

    // Save inspection data
    item.status = selectedStatus.value;

    item.comments =
        document.getElementById("inspectionComments").value;

    item.completedTime =
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    // Mark completed
    item.completed = true;

    item.text.textContent = "✅ " + item.label;
    item.item.classList.add("completed");

    // Update progress
    completedChecks = Object.values(checklistItems)
        .filter(item => item.completed).length;

    checklistProgress.textContent = completedChecks + " / 5";

    checklistFill.style.width =
        (completedChecks / 5 * 100) + "%";
if (completedChecks === 5) {

    reviewInspection.classList.remove("hidden");

}
    // Go back to checklist
    inspectionScreen.classList.add("hidden");
    checklistScreen.classList.remove("hidden");

    // Clear the form
    document.querySelectorAll('input[name="status"]')
        .forEach(radio => radio.checked = false);

    document.getElementById("inspectionComments").value = "";

    if (completedChecks === 5) {

    showToast("✅ All inspections completed!", "success");

} else {

    showToast("Inspection saved.", "success");

}

});

// Set today's date automatically
document.getElementById("flightDate").value =
    new Date().toISOString().split("T")[0];

// Continue button
document.getElementById("nextInbound").addEventListener("click", () => {

    const flight = document.getElementById("flightNumber").value.trim();
    const bay = document.getElementById("parkingBay").value.trim();
    const coordinator = document.getElementById("coordinator").value.trim();

    if (flight === "" || bay === "" || coordinator === "") {

        alert("Please complete all required fields.");
        return;

    }

   flightScreen.classList.add("hidden");
inboundScreen.classList.remove("hidden");

}); 
document.getElementById("nextChecklist").addEventListener("click", () => {

    const aircraft = document.getElementById("aircraftType").value;
    const registration = document.getElementById("registration").value;

    if (aircraft === "") {

        showToast("Please select an aircraft.", "error");
        return;

    }

    if (registration === "") {

        showToast("Please select a registration.", "error");
        return;

    }

    inboundScreen.classList.add("hidden");
    checklistScreen.classList.remove("hidden");

    showToast("Aircraft details saved.", "success");

});


function showToast(message, type = "info") {

    toast.textContent = message;

    toast.className = "toast";

    toast.classList.add(type);

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

function openInspection(itemKey) {

    currentInspection = itemKey;

    document.getElementById("inspectionTitle").textContent =
        checklistItems[itemKey].label;

    checklistScreen.classList.add("hidden");
    inspectionScreen.classList.remove("hidden");

}