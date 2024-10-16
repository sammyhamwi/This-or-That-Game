let mediaPairs = {};
let currentIndex = 0;
let currentPairs = [];
let currentCategory = '';

let isMediaOverlayOpen = false;
let isConfettiShooting = false;
let simpleMode = sessionStorage.getItem('simpleMode');

if (simpleMode === 'true') {
    document.getElementById('toggleSwitch').checked = true;
} else if (simpleMode === 'false') {
document.getElementById('toggleSwitch').checked = false;
}

function scrollBottomTop(direction) {
    if (!isMediaOverlayOpen) {
        if (direction === 1) {
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 300);
        }
        if (direction === 0) {
            setTimeout(() => {
                window.scrollTo({
                    top: document.documentElement.scrollHeight - window.innerHeight,
                    behavior: 'smooth'
                });
            }, 300); 
        }
    }
}
        
async function fetchMediaPairs() {
    const response = await fetch('/api/mediaPairs');
    if (!response.ok) {
        console.error('Failed to fetch media pairs');
        return;
    }
    mediaPairs = await response.json();
    document.getElementById('media-pairs').style.display = 'none';
}

function loadMediaPairs(category) {
    currentCategory = category;
    currentPairs = mediaPairs[category.toLowerCase()];
    if (!currentPairs || currentPairs.length === 0) {
        console.error(`No pairs found for category: ${category}`);
        return;
    }
    
    currentIndex = 0;
    displayCurrentPair();

    if(simpleMode === 'true'){;
        setTimeout(() => {openOverlay();}, 300);
    }
    
    document.getElementById('category-container').style.display = 'none';
}

async function displayCurrentPair() {
    document.getElementById('loadingSpinner').style.display = 'block';

    document.getElementById('vote1-container').style.display = 'none';
    document.getElementById('vote2-container').style.display = 'none';
    document.getElementById('submitVotes').style.display = 'none';
    document.getElementById('name1').style.display = 'none';
    document.getElementById('name2').style.display = 'none';
    document.getElementById('vs_title').style.display = 'none';
    document.getElementById('optionpairs').style.display = 'none';
    //document.getElementById('levelTitle').style.display = 'none';
    //document.getElementById('previousButton').style.display = 'none';
    //document.getElementById('nextButton').style.display = 'none';
    document.getElementById('viewButton').style.display = 'none';

    document.getElementById('backButton').style.display = 'block';

    const currentPair = currentPairs[currentIndex];
    const option1Img = document.getElementById("option1");
    const option2Img = document.getElementById("option2");
    
    const videoPlayer1 = document.getElementById("videoPlayer1");
    const videoPlayer2 = document.getElementById("videoPlayer2");
    
    const videoSource1 = document.getElementById("videoSource1");
    const videoSource2 = document.getElementById("videoSource2");

    const optionContent = document.getElementById("option-content");
    const ovBody = document.getElementById("ovBody");

    optionContent.style.opacity = '0';

    ovBody.style.opacity = '0';

    if (currentIndex === 0) {
        document.getElementById('previousButtonOV').style.opacity = '0';
        document.getElementById('previousButton').style.opacity = '0';
    } else {
        document.getElementById('previousButtonOV').disabled = false;
        document.getElementById('previousButtonOV').style.opacity = '1';
        document.getElementById('previousButtonOV').style.transition = 'opacity 0.5s ease';
    }

    option1Img.style.display = 'none';
    option2Img.style.display = 'none';
    videoPlayer1.style.display = 'none';
    videoPlayer2.style.display = 'none';

    setTimeout(() => {
        if (currentCategory.toLowerCase() === 'muziek') {
            videoSource1.src = currentPair.media[0];
            videoSource2.src = currentPair.media[1];

            videoPlayer1.style.display = 'block';
            videoPlayer2.style.display = 'block';

            videoPlayer1.load();
            videoPlayer2.load();
        } else {
            option1Img.src = currentPair.media[0];
            option2Img.src = currentPair.media[1];

            option1Img.style.display = 'block';
            option2Img.style.display = 'block';

            videoPlayer1.style.display = 'none';
            videoPlayer2.style.display = 'none';
        }

        document.getElementById('name1').textContent = currentPair.names[0];
        document.getElementById('name2').textContent = currentPair.names[1];
        document.getElementById('vs_title').textContent = "of";

        const levelTitle = `Niveau ${currentIndex + 1}`;
        document.getElementById('levelTitle').textContent = levelTitle;

        // Fetch votes
        fetch(`/api/getVotes/${currentCategory}/${currentIndex}`)
            .then(response => response.json())
            .then(votesData => {
                document.getElementById('vote1').value = 0;//votesData.vote1 || 0;
                document.getElementById('vote2').value = 0;//votesData.vote2 || 0;

                applyBorderColors(0, 0);
                applyConfetti(0, 0);

                //document.getElementById('levelTitle').style.opacity = '0';
                //document.getElementById('previousButton').style.opacity = '0';
                //document.getElementById('nextButton').style.opacity = '0';
                document.getElementById('viewButton').style.opacity = '0';

                document.getElementById('previousButton').disabled = true;
                document.getElementById('previousButtonOV').disabled = true;

                //document.getElementById('levelTitle').style.display = 'block';
                document.getElementById('previousButton').style.display = 'block';
                document.getElementById('nextButton').style.display = 'block';
                document.getElementById('viewButton').style.display = 'block';

                if (currentIndex > 0) {
                    document.getElementById('previousButton').disabled = false;
                    document.getElementById('previousButton').style.opacity = '1';
                    document.getElementById('previousButton').style.transition = 'opacity 0.5s ease';
                    if (isMediaOverlayOpen) {
                    document.getElementById('previousButtonOV').disabled = false;
                    document.getElementById('previousButtonOV').style.opacity = '1';
                    document.getElementById('previousButtonOV').style.transition = 'opacity 0.5s ease';
                    }
                }

                //document.getElementById('levelTitle').style.opacity = '1';
                //document.getElementById('levelTitle').style.transition = 'opacity 0.5s ease';
                document.getElementById('nextButton').style.opacity = '1';
                document.getElementById('nextButton').style.transition = 'opacity 0.5s ease';
                document.getElementById('viewButton').style.opacity = '1';
                document.getElementById('viewButton').style.transition = 'opacity 0.5s ease';
                
                optionContent.style.opacity = '1';
                optionContent.style.transition = 'opacity 0.5s ease';

                ovBody.style.opacity = '1';
                ovBody.style.transition = 'opacity 0.5s ease';

                document.getElementById('vote1-container').style.display = 'flex';
                document.getElementById('vote2-container').style.display = 'flex';
                document.getElementById('optionpairs').style.display = 'flex';
                document.getElementById('name1').style.display = 'block';
                document.getElementById('name2').style.display = 'block';
                document.getElementById('vs_title').style.display = 'block';
                document.getElementById('submitVotes').style.display = 'block';

                document.getElementById('loadingSpinner').style.display = 'none';

                scrollBottomTop(0);
            });
    }, 500);
}


function applyBorderColors(vote1, vote2) {
    const option1Img = document.getElementById("option1");
    const option2Img = document.getElementById("option2");
    const videoPlayer1 = document.getElementById("videoPlayer1");
    const videoPlayer2 = document.getElementById("videoPlayer2");

    option1Img.classList.remove('winner', 'loser');
    option2Img.classList.remove('winner', 'loser');
    videoPlayer1.classList.remove('winner', 'loser');
    videoPlayer2.classList.remove('winner', 'loser');

    option1Img.style.transform = 'scale(1)'; 
    option2Img.style.transform = 'scale(1)'; 
    videoPlayer1.style.transform = 'scale(1)'; 
    videoPlayer2.style.transform = 'scale(1)'; 

    if (vote1 > 0 || vote2 > 0) {
        if (vote1 > vote2) {
            option1Img.classList.add('winner');
            option2Img.classList.add('loser');
            videoPlayer1.classList.add('winner');
            videoPlayer2.classList.add('loser');

            option1Img.style.transform = 'scale(1.1)'; 
            videoPlayer1.style.transform = 'scale(1.1)'; 
        } else if (vote2 > vote1) {
            option2Img.classList.add('winner');
            option1Img.classList.add('loser');
            videoPlayer2.classList.add('winner');
            videoPlayer1.classList.add('loser');

            option2Img.style.transform = 'scale(1.1)'; 
            videoPlayer2.style.transform = 'scale(1.1)'; 
        } else {
            option1Img.classList.add('winner');
            option2Img.classList.add('winner');
            videoPlayer1.classList.add('winner');
            videoPlayer2.classList.add('winner');

            option1Img.style.transform = 'scale(1.1)'; 
            option2Img.style.transform = 'scale(1.1)'; 
            videoPlayer1.style.transform = 'scale(1.1)'; 
            videoPlayer2.style.transform = 'scale(1.1)'; 
        }
    }

    if (isMediaOverlayOpen) {
        if (currentCategory.toLowerCase() === 'muziek') {
            document.getElementById("videoPlayer1-ov").classList.add('left-choice');
            document.getElementById("videoPlayer2-ov").classList.add('right-choice');
            document.getElementById("videoPlayer1-ov").classList.remove('winner-ov', 'loser-ov');
            document.getElementById("videoPlayer2-ov").classList.remove('winner-ov', 'loser-ov');
            document.getElementById("videoPlayer1-ov").style.transform = 'scale(1)'; 
            document.getElementById("videoPlayer2-ov").style.transform = 'scale(1)';
            if (vote1 > 0 || vote2 > 0) {
                if (vote1 > vote2) {
                    document.getElementById("videoPlayer1-ov").classList.add('winner-ov');
                    document.getElementById("videoPlayer2-ov").classList.add('loser-ov');
                    document.getElementById("videoPlayer1-ov").style.transform = 'scale(1.1)';   
                } else if (vote2 > vote1) {
                    document.getElementById("videoPlayer2-ov").classList.add('winner-ov');
                    document.getElementById("videoPlayer1-ov").classList.add('loser-ov');
                    document.getElementById("videoPlayer2-ov").style.transform = 'scale(1.1)';   
                } else {
                    document.getElementById("videoPlayer1-ov").classList.add('winner-ov');
                    document.getElementById("videoPlayer2-ov").classList.add('winner-ov');
                    document.getElementById("videoPlayer1-ov").style.transform = 'scale(1.1)'; 
                    document.getElementById("videoPlayer2-ov").style.transform = 'scale(1.1)';
                }
            }
        } else {
            document.getElementById("option1-ov").classList.add('left-choice');
            document.getElementById("option2-ov").classList.add('right-choice');
            document.getElementById("option1-ov").classList.remove('winner-ov', 'loser-ov');
            document.getElementById("option2-ov").classList.remove('winner-ov', 'loser-ov');
            document.getElementById("option1-ov").style.transform = 'scale(1)'; 
            document.getElementById("option2-ov").style.transform = 'scale(1)';
            if (vote1 > 0 || vote2 > 0) {
                if (vote1 > vote2) {
                    document.getElementById("option1-ov").classList.add('winner-ov');
                    document.getElementById("option2-ov").classList.add('loser-ov');
                    document.getElementById("option1-ov").style.transform = 'scale(1.1)';   
                } else if (vote2 > vote1) {
                    document.getElementById("option2-ov").classList.add('winner-ov');
                    document.getElementById("option1-ov").classList.add('loser-ov');
                    document.getElementById("option2-ov").style.transform = 'scale(1.1)';   
                } else {
                    document.getElementById("option1-ov").classList.add('winner-ov');
                    document.getElementById("option2-ov").classList.add('winner-ov');
                    document.getElementById("option1-ov").style.transform = 'scale(1.1)'; 
                    document.getElementById("option2-ov").style.transform = 'scale(1.1)';
                }
            }
        }
    }
}


document.getElementById('submitVotes').addEventListener('click', () => {
    const vote1 = parseInt(document.getElementById('vote1').value) || 0;
    const vote2 = parseInt(document.getElementById('vote2').value) || 0;

    // Save the votes as before
    fetch('/api/saveVotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: currentCategory, index: currentIndex, vote1, vote2 })
    });

    applyBorderColors(vote1, vote2);
    scrollBottomTop(0);
    applyConfetti(vote1, vote2);
});

document.getElementById('leftVoteButton').addEventListener('click', () => {
    const vote1 = 1;
    const vote2 = 0;

    fetch('/api/saveVotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: currentCategory, index: currentIndex, vote1, vote2 })
    });

    document.getElementById('vote1').value = vote1;
    document.getElementById('vote2').value = vote2;
    applyBorderColors(vote1, vote2);
    scrollBottomTop(0);
    applyConfetti(vote1, vote2);
});

;document.getElementById('tieVoteButton').addEventListener('click', () => {
    const vote1 = 1;
    const vote2 = 1;

    fetch('/api/saveVotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: currentCategory, index: currentIndex, vote1, vote2 })
    });
    
    document.getElementById('vote1').value = vote1;
    document.getElementById('vote2').value = vote2;
    applyBorderColors(vote1, vote2);
    scrollBottomTop(0);
    applyConfetti(vote1, vote2);
});

document.getElementById('rightVoteButton').addEventListener('click', () => {
    const vote1 = 0;
    const vote2 = 1;

    fetch('/api/saveVotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: currentCategory, index: currentIndex, vote1, vote2 })
    });
    
    document.getElementById('vote1').value = vote1;
    document.getElementById('vote2').value = vote2;
    applyBorderColors(vote1, vote2);
    scrollBottomTop(0);
    applyConfetti(vote1, vote2);
});

document.getElementById('backButtonComplete').addEventListener('click', () => {
    isConfettiShooting = false;
    const option1Img = document.getElementById("option1");
    const option2Img = document.getElementById("option2");
    const videoPlayer1 = document.getElementById("videoPlayer1");
    const videoPlayer2 = document.getElementById("videoPlayer2");

    videoPlayer1.pause();
    videoPlayer1.currentTime = 0;
    videoPlayer2.pause();
    videoPlayer2.currentTime = 0;

    option1Img.classList.remove('winner', 'loser');
    option2Img.classList.remove('winner', 'loser');
    videoPlayer1.classList.remove('winner', 'loser');
    videoPlayer2.classList.remove('winner', 'loser');

    option1Img.classList.add('left-choice');
    option2Img.classList.add('right-choice');
    videoPlayer1.classList.add('left-choice');
    videoPlayer2.classList.add('right-choice');

    document.getElementById('optionpairs').style.display = 'none';
    document.getElementById('category-container').style.display = 'block';
    document.getElementById('backButton').style.display = 'none';
    document.getElementById('viewButton').style.display = 'none';
    document.getElementById('previousButton').style.display = 'none';
    document.getElementById('nextButton').style.display = 'none';
    
    document.getElementById('levelTitle').textContent = '';

    currentIndex = 0; 
    currentPairs = [];
});

document.getElementById('backButton').addEventListener('click', () => {
    isConfettiShooting = false;
    const option1Img = document.getElementById("option1");
    const option2Img = document.getElementById("option2");
    const videoPlayer1 = document.getElementById("videoPlayer1");
    const videoPlayer2 = document.getElementById("videoPlayer2");

    videoPlayer1.pause();
    videoPlayer1.currentTime = 0;
    videoPlayer2.pause();
    videoPlayer2.currentTime = 0;

    option1Img.classList.remove('winner', 'loser');
    option2Img.classList.remove('winner', 'loser');
    videoPlayer1.classList.remove('winner', 'loser');
    videoPlayer2.classList.remove('winner', 'loser');

    option1Img.classList.add('left-choice');
    option2Img.classList.add('right-choice');
    videoPlayer1.classList.add('left-choice');
    videoPlayer2.classList.add('right-choice');

    document.getElementById('optionpairs').style.display = 'none';
    document.getElementById('category-container').style.display = 'block';
    document.getElementById('backButton').style.display = 'none';
    document.getElementById('viewButton').style.display = 'none';
    document.getElementById('previousButton').style.display = 'none';
    document.getElementById('nextButton').style.display = 'none';
    
    document.getElementById('levelTitle').textContent = '';

    currentIndex = 0; 
    currentPairs = [];
});

document.addEventListener("keydown", (event) => {
    if (document.getElementById('completedModal').classList.contains('show')) return;

    if (currentPairs.length === 0) return;

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        if (event.key === "ArrowRight") {
            isConfettiShooting = false;
            if (currentIndex === currentPairs.length - 1) {
                console.log('Reached the last pair!');
                document.getElementById('completedModalLabel').textContent = `Categorie voltooid - ${currentCategory}`;
                document.getElementById('completeModalPara').textContent = `Je hebt alle niveaus in de categorie ${currentCategory} voltooid.`;
                if (document.getElementById('mediaOverlay').classList.contains('show')  || simpleMode === 'true') {
                    $('#mediaOverlay').modal('hide');
                    triggerConfettiTie(true);
                } else {
                    triggerConfettiTie(false);
                    document.getElementById('pageContent').style.display = 'none';
                }
                $('#completedModal').modal('show');
                return;
            }
            currentIndex = (currentIndex + 1) % currentPairs.length;
            displayCurrentPair();
        } else if (event.key === "ArrowLeft") {
            if (currentIndex === 0) {
                console.log('Already at the first pair, cannot go left.');
                return;
            }

            isConfettiShooting = false;
            currentIndex = (currentIndex - 1 + currentPairs.length) % currentPairs.length;
            displayCurrentPair();
        }
        if (document.getElementById('mediaOverlay').classList.contains('show') || simpleMode === 'true') {
            isConfettiShooting = false;
            setTimeout(() => {openOverlay();}, 300);
        }
    }
});

document.getElementById('nextButton').addEventListener('click', () => {
    if (currentIndex === currentPairs.length - 1) {
        console.log('Reached the last pair!');
        document.getElementById('completedModalLabel').textContent = `Categorie voltooid - ${currentCategory}`;
        document.getElementById('completeModalPara').textContent = `Je hebt alle niveaus in de categorie ${currentCategory} voltooid.`;
        triggerConfettiTie(false);
        document.getElementById('pageContent').style.display = 'none';
        $('#completedModal').modal('show');
        return;
    }

    isConfettiShooting = false;
    currentIndex = (currentIndex + 1) % currentPairs.length;
    displayCurrentPair();
    if (document.getElementById('mediaOverlay').classList.contains('show') || simpleMode === 'true') {
        isConfettiShooting = false;
        setTimeout(() => {openOverlay();}, 300);
    }
});

document.getElementById('previousButton').addEventListener('click', () => {
    isConfettiShooting = false;
    currentIndex = (currentIndex - 1 + currentPairs.length) % currentPairs.length;
    displayCurrentPair();
    if (document.getElementById('mediaOverlay').classList.contains('show') || simpleMode === 'true') {
        isConfettiShooting = false;
        setTimeout(() => {openOverlay();}, 300);
    }
});

document.getElementById('nextButtonOV').addEventListener('click', () => {
    if (currentIndex === currentPairs.length - 1) {
        console.log('Reached the last pair!');
        document.getElementById('completedModalLabel').textContent = `Categorie voltooid - ${currentCategory}`;
        document.getElementById('completeModalPara').textContent = `Je hebt alle niveaus in de categorie ${currentCategory} voltooid.`;
        triggerConfettiTie(true);
        $('#mediaOverlay').modal('hide');
        $('#completedModal').modal('show');
        return;
    }

    isConfettiShooting = false;
    currentIndex = (currentIndex + 1) % currentPairs.length;
    displayCurrentPair();
    if (document.getElementById('mediaOverlay').classList.contains('show') || simpleMode === 'true') {
        isConfettiShooting = false;
        setTimeout(() => {openOverlay();}, 300);
    }
});

document.getElementById('previousButtonOV').addEventListener('click', () => {
    isConfettiShooting = false;
    currentIndex = (currentIndex - 1 + currentPairs.length) % currentPairs.length;
    displayCurrentPair();
    if (document.getElementById('mediaOverlay').classList.contains('show') || simpleMode === 'true') {
        isConfettiShooting = false;
        setTimeout(() => {openOverlay();}, 300);
    }
});

document.getElementById('closeov').addEventListener('click', () => {

    isConfettiShooting = false;

    if (simpleMode === 'true'){
        const overlayContainer = document.getElementById('overlayMediaContainer');
        const mediaOverlayLabel = document.getElementById('mediaOverlayLabel');

        overlayContainer.innerHTML = '';
        mediaOverlayLabel.innerHTML = '';

        $('#mediaOverlay').modal('hide');

        const option1Img = document.getElementById("option1");
        const option2Img = document.getElementById("option2");
        const videoPlayer1 = document.getElementById("videoPlayer1");
        const videoPlayer2 = document.getElementById("videoPlayer2");

        videoPlayer1.pause();
        videoPlayer1.currentTime = 0;
        videoPlayer2.pause();
        videoPlayer2.currentTime = 0;

        option1Img.classList.remove('winner', 'loser');
        option2Img.classList.remove('winner', 'loser');
        videoPlayer1.classList.remove('winner', 'loser');
        videoPlayer2.classList.remove('winner', 'loser');

        option1Img.classList.add('left-choice');
        option2Img.classList.add('right-choice');
        videoPlayer1.classList.add('left-choice');
        videoPlayer2.classList.add('right-choice');

        document.getElementById('optionpairs').style.display = 'none';
        document.getElementById('category-container').style.display = 'block';
        document.getElementById('backButton').style.display = 'none';
        document.getElementById('viewButton').style.display = 'none';
        document.getElementById('previousButton').style.display = 'none';
        document.getElementById('nextButton').style.display = 'none';
        
        document.getElementById('levelTitle').textContent = '';

        currentIndex = 0; 
        currentPairs = [];
    } else {
        const overlayContainer = document.getElementById('overlayMediaContainer');
        const mediaOverlayLabel = document.getElementById('mediaOverlayLabel');

        overlayContainer.innerHTML = '';
        mediaOverlayLabel.innerHTML = '';

        $('#mediaOverlay').modal('hide');
    }
});

document.getElementById('viewButton').addEventListener('click', async () => {
    const videoPlayer1 = document.getElementById("videoPlayer1");
    const videoPlayer2 = document.getElementById("videoPlayer2");

    videoPlayer1.pause();
    videoPlayer1.currentTime = 0;
    videoPlayer2.pause();
    videoPlayer2.currentTime = 0;
});

document.getElementById('passwordStatsInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('submitStatsPassword').click();
    }
});
        
document.getElementById('statsLink').onclick = async function () {
    isConfettiShooting = false;
    const isAuthenticatedForStats = await checkStatsAuthentication();

    if (isAuthenticatedForStats) {
        window.location.href = '/stats';
    } else {
        requestStatsPinForPage();
    }
};

async function checkStatsAuthentication() {
    try {
        const response = await fetch('/api/checkStatsAuth');
        const data = await response.json();
        return data.authStatsStatus;
    } catch (error) {
        console.error('Error checking stats authentication:', error);
        return false;
    }
}

function requestStatsPinForPage() {
    $('#passwordStatsModal').modal('show');
    
    document.getElementById('submitStatsPassword').onclick = async function () {
        const enteredStatsPin = document.getElementById('passwordStatsInput').value.trim();
        
        try {
            const responseStats = await fetch('/api/validateStatsPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: enteredStatsPin }),
            });

            const dataStats = await responseStats.json();

            if (dataStats.valid) {
                sessionStorage.setItem('pinStatsCorrect', true);
                $('#passwordStatsModal').modal('hide');
                window.location.href = '/stats';
            } else {
                $('#passwordStatsModal').modal('hide');
                $('#incorrectStatsModal').modal('show');
                document.getElementById('passwordStatsInput').value = "";
                document.getElementById('incorrectStatsPassword').onclick = function () {
                    $('#incorrectStatsModal').modal('hide');
                };
            }
        } catch (error) {
            console.error('Error validating stats PIN:', error);
        }
    };
}

async function openOverlay() {
    document.getElementById('pageContent').style.display = 'none';
    const overlayContainer = document.getElementById('overlayMediaContainer');
    const mediaOverlayLabel = document.getElementById('mediaOverlayLabel');
    overlayContainer.innerHTML = '';
    mediaOverlayLabel.innerHTML = '';
    const levelTitle = `Niveau ${currentIndex + 1}`;

    const label = document.createElement('b');
    label.classList.add('green-ov-label');
    label.textContent = `${currentCategory} - ${levelTitle}`;
    mediaOverlayLabel.appendChild(label);

    const currentPair = currentPairs[currentIndex];

    const name1 = currentPair.names[0];
    const name2 = currentPair.names[1];

    const imgDiv1 = document.createElement('div');
    imgDiv1.classList.add('col-5', 'text-center', 'mb-3');
    imgDiv1.id = "imgDiv1";

    const nameLabel1 = document.createElement('h1'); 
    nameLabel1.classList.add('ov-choice-name-left');
    nameLabel1.textContent = name1;
    imgDiv1.appendChild(nameLabel1); 

    if (currentCategory.toLowerCase() === 'muziek') {
        const videoWrapper1 = document.createElement('div');
        videoWrapper1.classList.add('video-wrapper');
        videoWrapper1.id = "videoWrapper1";

        const video1 = document.createElement('video');
        video1.src = currentPair.media[0];
        video1.classList.add('img-fluid', 'videosize');
        video1.id = "videoPlayer1-ov";
        video1.controls = true;

        videoWrapper1.appendChild(video1);
        imgDiv1.appendChild(videoWrapper1);
    } else {
        const img1 = document.createElement('img');
        img1.src = currentPair.media[0]; 
        img1.alt = "Option 1 Media";
        img1.classList.add('img-fluid');
        img1.id = "option1-ov";
        imgDiv1.appendChild(img1);
    }
    overlayContainer.appendChild(imgDiv1);

    const vsDiv = document.createElement('div');
    vsDiv.classList.add('col-1', 'text-center', 'mb-3');
    const vsLabel = document.createElement('h2');
    vsLabel.classList.add('ov-vslabel');
    vsLabel.textContent = "of";
    vsDiv.appendChild(vsLabel);
    overlayContainer.appendChild(vsDiv);

    const imgDiv2 = document.createElement('div');
    imgDiv2.classList.add('col-5', 'text-center', 'mb-3');

    const nameLabel2 = document.createElement('h1');
    nameLabel2.classList.add('ov-choice-name-right');
    nameLabel2.textContent = name2;
    imgDiv2.appendChild(nameLabel2);
    imgDiv2.id = "imgDiv2";

    if (currentCategory.toLowerCase() === 'muziek') {
        const videoWrapper2 = document.createElement('div');
        videoWrapper2.classList.add('video-wrapper');
        videoWrapper2.id = "videoWrapper2";

        const video2 = document.createElement('video');
        video2.src = currentPair.media[1];
        video2.classList.add('img-fluid');
        video2.id = "videoPlayer2-ov";
        video2.controls = true;

        videoWrapper2.appendChild(video2);
        imgDiv2.appendChild(videoWrapper2);
    } else {
        const img2 = document.createElement('img');
        img2.src = currentPair.media[1];
        img2.alt = "Option 2 Media";
        img2.classList.add('img-fluid');
        img2.id = "option2-ov";
        imgDiv2.appendChild(img2);
    }

    overlayContainer.appendChild(imgDiv2);

    $('#mediaOverlay').modal({
        keyboard: false, // Disable closing on Escape key
        backdrop: 'static' // Disable closing by clicking outside the modal
    });

    $('#mediaOverlay').modal('show');

    isMediaOverlayOpen = true;

    if (parseInt(document.getElementById('vote1').value) > 0 || parseInt(document.getElementById('vote2').value) > 0){
        applyBorderColors(parseInt(document.getElementById('vote1').value), parseInt(document.getElementById('vote2').value));
    } else {
        applyBorderColors(0, 0);
    }

    /*
    const storedVotes = await fetch(`/api/getVotes/${currentCategory}/${currentIndex}`);
    const votesData = await storedVotes.json();

    //document.getElementById('vote1').value = votesData.vote1 || 0;
    //document.getElementById('vote2').value = votesData.vote2 || 0;

    if (votesData.vote1 > 0 || votesData.vote2 > 0) {
        setTimeout(() => {
            applyBorderColors(parseInt(document.getElementById('vote1').value), parseInt(document.getElementById('vote2').value));
            applyConfetti(parseInt(document.getElementById('vote1').value), parseInt(document.getElementById('vote2').value));
        }, 200);
        console.log('1');
    } else {
        applyBorderColors(parseInt(document.getElementById('vote1').value), parseInt(document.getElementById('vote2').value));
        applyConfetti(parseInt(document.getElementById('vote1').value), parseInt(document.getElementById('vote2').value));
        console.log('2 '+document.getElementById('vote1').value+' '+document.getElementById('vote2').value);
    }
    */

}

async function closeOverlay() {
    document.getElementById('pageContent').style.display = 'block';
    isMediaOverlayOpen = false;
    scrollBottomTop(0);
}

function applyConfetti(vote1, vote2) {
    setTimeout(() => {
        if (vote1 > 0 || vote2 > 0) {
            if (vote1 > vote2) {
                if (isMediaOverlayOpen) {
                    shootConfetti('left', currentCategory.toLowerCase() === 'muziek' ? 'videoPlayer1-ov' : 'option1-ov');
                } else {
                    shootConfetti('left', currentCategory.toLowerCase() === 'muziek' ? 'videoPlayer1' : 'option1');
                }
            } else if (vote2 > vote1) {
                if (isMediaOverlayOpen) {
                    shootConfetti('right', currentCategory.toLowerCase() === 'muziek' ? 'videoPlayer2-ov' : 'option2-ov');
                } else {
                    shootConfetti('right', currentCategory.toLowerCase() === 'muziek' ? 'videoPlayer2' : 'option2');
                }
            } else {
                shootConfetti('tie', '', isMediaOverlayOpen);
            }
        }
    }, 500);
}

function shootConfetti(direction, elementid, overlayMode) {
    if (isConfettiShooting) return; 
    isConfettiShooting = true;

    let count = 0; 
    const maxCount = 3; 
    const interval = setInterval(() => {
        if (!isConfettiShooting) {
            clearInterval(interval);
            return; 
        }
        if (direction === 'left') {
            triggerConfettiLeft(elementid);
        } else if (direction === 'right') {
            triggerConfettiRight(elementid);
        } else if (direction === 'tie') {
            triggerConfettiTie(overlayMode);
        }
        count++;

        if (count >= maxCount) {
            clearInterval(interval);
            isConfettiShooting = false;
        }
    }, 700);
}

function triggerConfettiTie(isOverlay) {
    let targetElement;
    
    if (isOverlay) {
        targetElement = document.querySelector('.modal-body');
    } else {
        targetElement = document.getElementById('optionpairs');
    }

    const rect = targetElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 4;

    // Number of particles for a big burst
    const particles = 1000; 
    const colors = ['#5ce65c'];

    for (let i = 0; i < particles; i++) {
        confetti({
            angle: Math.random() * 360,
            spread: 125, 
            startVelocity: 40,
            particleCount: 1,
            origin: { 
                x: centerX / window.innerWidth,
                y: centerY / window.innerHeight
            },
            colors: [colors[Math.floor(Math.random() * colors.length)]],
            scalar: 2
        });
    }
}

function triggerConfettiLeft(elementid) {
    const img = document.getElementById(elementid);
    const rect = img.getBoundingClientRect();
    const x = rect.left + rect.width / 1.3;
    const y = rect.top + rect.height / 5;

    const particles = 750; 
    const colors = ['#ff2c2c'];

    for (let i = 0; i < particles; i++) {
        confetti({
            angle: Math.random() * 60 + 150,
            spread: 125, 
            startVelocity: 40,
            particleCount: 1, 
            origin: { x: x / window.innerWidth, y: y / window.innerHeight },
            colors: [colors[Math.floor(Math.random() * colors.length)]],
            scalar: 2,
            className: 'confetti'
        });
    }
}

function triggerConfettiRight(elementid) {
    const img = document.getElementById(elementid);
    const rect = img.getBoundingClientRect();
    const x = rect.left + rect.width / 2.7;
    const y = rect.top + rect.height / 5;

    const particles = 750; 
    const colors = ['#0066ff'];

    for (let i = 0; i < particles; i++) {
        confetti({
            angle: Math.random() * 60 + 330,
            spread: 125,
            startVelocity: 40,
            particleCount: 1,
            origin: { x: x / window.innerWidth, y: y / window.innerHeight },
            colors: [colors[Math.floor(Math.random() * colors.length)]],
            scalar: 2,
            className: 'confetti'
        });
    }
}

function handleToggle() {
    const isChecked = document.getElementById('toggleSwitch').checked;
    sessionStorage.setItem('simpleMode', isChecked ? true : false);
    simpleMode = sessionStorage.getItem('simpleMode');
}

fetchMediaPairs();
