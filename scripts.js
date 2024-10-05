// Initialize default values
let currentColors = [];
let currentFontSize = 2; // Initial font size in em
const fonts = [
    "'Gloria Hallelujah', cursive",
    "'Comic Neue', cursive",
    "'Indie Flower', cursive"
];
let currentFontIndex = 0;
let trailColor = 'gold'; // Initial trail color

// Event listener for the DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    setPalette('rainbow'); // Default palette

    const editor = document.getElementById('editor');
    const controls = document.getElementById('controls');

    // Delegate events for buttons using switch
    controls.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return; // Ignore clicks outside of buttons

        const action = button.dataset.action;

        switch (action) {
            case 'increase-font':
                increaseFontSize();
                break;
            case 'decrease-font':
                decreaseFontSize();
                break;
            case 'toggle-font':
                toggleFont();
                break;
            case 'set-palette':
                const palette = button.dataset.palette;
                setPalette(palette);
                break;
            default:
                console.warn('Unknown action:', action);
        }
    });

    // Event listeners for editor input and keypress
    editor.addEventListener('input', handleInput);
    editor.addEventListener('keypress', playTypingSound);
    document.addEventListener('mousemove', createTrail);
});

// Remaining functions (handleInput, playTypingSound, setPalette, etc.) go here...

// Function to handle input in the editor
function handleInput() {
    const editor = document.getElementById('editor');
    const content = editor.innerText;
    const asciiArts = editor.getElementsByClassName('ascii-art');
    editor.innerHTML = '';

    let asciiArtIndex = 0;
    for (let i = 0; i < content.length; i++) {
        // Check if this position matches an ASCII art placeholder
        if (asciiArtIndex < asciiArts.length && i === asciiArts[asciiArtIndex].dataset.startIndex) {
            // Append the ASCII art div
            editor.appendChild(asciiArts[asciiArtIndex].cloneNode(true));
            i += asciiArts[asciiArtIndex].textContent.length - 1; // Skip the ASCII art length
            asciiArtIndex++;
            continue;
        }

        // Wrap each character in a span with a color
        const span = document.createElement('span');
        span.style.color = currentColors[i % currentColors.length];
        span.textContent = content[i];
        editor.appendChild(span);
    }

    // Restore caret position
    const range = document.createRange();
    const selection = window.getSelection();
    if (editor.childNodes.length > 0) {
        range.setStart(editor.childNodes[editor.childNodes.length - 1], 1);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

// Function to play typing sound
function playTypingSound(event) {
    const typingSound = document.getElementById('typingSound');
    typingSound.currentTime = 0; // Reset sound
    typingSound.play().catch(error => {
        console.error('Error playing typing sound:', error);
    });
}

// Function to set color palette
function setPalette(palette) {
    const paletteSound = document.getElementById('paletteSound');
    const editor = document.getElementById('editor');
    const topHeader = document.getElementById('top-header');

    // Remove all possible palette classes
    editor.classList.remove('rainbow', 'pastel', 'neon');

    switch (palette) {
        case 'rainbow':
            currentColors = generateRainbowColors();
            editor.classList.add('rainbow');
            editor.style.backgroundColor = '#34495e';
            editor.style.color = '#ffffff';
            document.body.style.backgroundColor = '#d3e0dc';
            topHeader.style.color = '#00BFFF80'; // Set header text color
            trailColor = '#00BFFF80';
            triggerBubbleEffect();
            break;
        case 'pastel':
            currentColors = generatePastelColors();
            editor.classList.add('pastel');
            editor.style.backgroundColor = '#f8f9fa'; // Light gray background for pastel
            editor.style.color = '#333333'; // Darker text color for contrast
            document.body.style.backgroundColor = '#ffe4e1';
            topHeader.style.color = '#FF69B4'; // Set header text color
            trailColor = '#FF69B4';
            triggerLeafEffect();
            break;
        case 'neon':
            currentColors = generateNeonColors();
            editor.classList.add('neon');
            editor.style.backgroundColor = '#1a1a1a';
            editor.style.color = '#00FFFF';
            document.body.style.backgroundColor = '#000000';
            topHeader.style.color = '#FFFFFF'; // Set header text color
            trailColor = '#FFFFFF';
            triggerStarEffect();
            break;
        default:
            currentColors = generateRainbowColors();
            editor.classList.add('rainbow');
            editor.style.backgroundColor = '#34495e';
            editor.style.color = '#ffffff';
            document.body.style.backgroundColor = '#d3e0dc';
            topHeader.style.color = '#DAA520'; // Default header text color
            trailColor = '#DAA520';
    }

    paletteSound.currentTime = 0;
    paletteSound.play().catch(error => {
        console.error('Error playing palette sound:', error);
    });

    handleInput();
}

// Function to increase font size
function increaseFontSize() {
    currentFontSize += 0.5;
    const editor = document.getElementById('editor');
    editor.style.fontSize = `${currentFontSize}em`;
}

// Function to decrease font size
function decreaseFontSize() {
    currentFontSize = Math.max(0.5, currentFontSize - 0.5);
    const editor = document.getElementById('editor');
    editor.style.fontSize = `${currentFontSize}em`;
}

// Function to toggle font family
function toggleFont() {
    currentFontIndex = (currentFontIndex + 1) % fonts.length;
    const editor = document.getElementById('editor');
    editor.style.fontFamily = fonts[currentFontIndex];
}

// Function to generate rainbow colors
function generateRainbowColors() {
    return [
        '#FF5733', '#FFBD33', '#DBFF33', '#75FF33', '#33FF57',
        '#33FFBD', '#33DBFF', '#3375FF', '#5733FF', '#BD33FF',
        '#FF33DB', '#FF3375', '#FF5733', '#FFBD33', '#DBFF33',
        '#75FF33', '#33FF57', '#33FFBD', '#33DBFF'
    ];
}

// Function to generate more readable pastel colors
function generatePastelColors() {
    return [
        '#FFB3B3', '#FFCCB3', '#FFE5B3', '#FFFFB3', '#D6FFB3',
        '#B3FFCC', '#B3FFE5', '#B3FFFF', '#B3D6FF', '#B3B3FF',
        '#CCB3FF', '#E5B3FF', '#FFB3E5', '#FFB3CC', '#FFC1B3',
        '#FFDAB3', '#FFEFB3', '#E5FFB3', '#CCFFB3', '#B3FFC1'
    ];
}

// Function to generate neon colors
function generateNeonColors() {
    return [
        '#FF6EC7', '#FFD700', '#7FFF00', '#00FF7F', '#00FFFF',
        '#1E90FF', '#FF1493', '#FF4500', '#FF6347', '#32CD32',
        '#FF6EC7', '#FFD700', '#7FFF00', '#00FF7F', '#00FFFF',
        '#1E90FF', '#FF1493', '#FF4500', '#FF6347'
    ];
}

// Function to create mouse trail effect
function createTrail(event) {
    const trail = document.createElement('div');
    trail.className = 'trail';
    trail.style.backgroundColor = trailColor;
    document.body.appendChild(trail);
    trail.style.left = `${event.pageX}px`;
    trail.style.top = `${event.pageY}px`;

    // Remove trail after 500ms
    setTimeout(() => {
        trail.remove();
    }, 500);
}

// Function to trigger bubble effect
function triggerBubbleEffect() {
    for (let i = 0; i < 25; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.backgroundColor = `rgba(0, 191, 255, ${Math.random()})`;
        bubble.style.width = `${Math.random() * 50 + 30}px`;
        bubble.style.height = bubble.style.width;
        bubble.style.left = `${Math.random() * window.innerWidth}px`;
        bubble.style.bottom = '0px';
        document.body.appendChild(bubble);

        // Remove bubble after 5000ms
        setTimeout(() => {
            bubble.remove();
        }, 5000);
    }
}

// Function to trigger leaf effect
function triggerLeafEffect() {
    for (let i = 0; i < 30; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.width = `${Math.random() * 15 + 10}px`;
        leaf.style.height = leaf.style.width;
        leaf.style.left = `${Math.random() * window.innerWidth}px`;
        leaf.style.top = `-${Math.random() * 50}px`;
        document.body.appendChild(leaf);

        // Remove leaf after 6000ms
        setTimeout(() => {
            leaf.remove();
        }, 6000);
    }
}

// Function to trigger star effect
function triggerStarEffect() {
    for (let i = 0; i < 25; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * window.innerWidth}px`;
        star.style.top = `-${Math.random() * 50}px`;
        document.body.appendChild(star);

        // Remove star after 4000ms
        setTimeout(() => {
            star.remove();
        }, 4000);
    }
}

// Function to insert ASCII art
function insertAsciiArt(character) {
    const editor = document.getElementById('editor');
    let art = '';
    if (character === 'pikachu') {
        art = `
⠀⠀⠀⠀⠀⠀⠀⣠⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣰⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢠⠋⠁⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡆⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⠁⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡠⠤⠀⠒⣶⣶⡶⠂⠀
⠀⠀⠀⠀⢸⢀⠠⠔⠒⠒⠒⠒⠂⠤⣀⠤⠒⠉⠀⠀⠀⢀⡠⠟⠉⠀⠀⠀
⠀⠀⠀⠀⡸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⣀⠠⠐⠊⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⢃⣖⢢⠀⠀⠀⠀⠀⣠⢤⣄⠀⠈⡄⠀⠀⣀⠠⠄⠀⠒⠒⠀⠇
⠀⠀⠀⡜⠈⠛⠛⠀⣐⠂⠀⠀⠻⠿⠏⠀⠀⡗⠊⠁⠀⠀⠀⠀⠀⠀⡜⠀
⠀⠀⢰⠉⢱⠀⠱⠞⠁⠉⠒⡖⠀⢀⠔⠢⡄⡇⠀⠀⠀⠀⠀⠀⠀⡐⠀⠀
⠀⠀⠀⢶⠊⠀⠀⢣⠀⠀⢠⠃⠀⠘⢄⣀⢾⠃⠀⡤⠤⠤⠤⠤⠔⠀⠀⠀
⠀⠀⠀⠀⢱⢄⠀⠀⠢⠔⠃⠀⠀⠀⠀⢀⢎⢢⠀⠰⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣌⠀⠁⠂⠀⠀⠀⠀⠀⠐⠈⠁⢸⡤⠓⢀⡇⠀⠀⠀⠀⠀⠀⠀
⣄⡀⠀⣰⢸⠀⠀⠀⠀⢀⢀⠂⠀⠀⠀⠀⠄⢳⡈⢁⡀⠀⠀⠀⠀⠀⠀⠀
⢿⣷⠁⠀⠈⡄⠀⠀⠀⠈⡞⠀⠀⠀⠀⡰⠉⠀⢈⠻⠿⠀⠀⠀⠀⠀⠀⠀
⡇⠈⡆⠀⠀⠱⡀⠀⠀⠀⡇⠀⠀⠀⢠⠁⠀⠀⠈⢀⠇⠀⠀⠀⠀⠀⠀⠀
⠘⡄⢀⠀⠀⠀⠱⡀⠀⠀⠁⠀⠀⡠⠁⠀⠀⢰⠀⡜⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠈⠉⠉⠉⠀⠐⠛⠶⠒⠣⠦⠤⠗⠒⠒⠒⠚⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀
`;
    } else if (character === 'doraemon') {
        art = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣴⣶⣶⣶⣶⣶⠶⣶⣤⣤⣀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣤⣾⣿⣿⣿⠁⠀⢀⠈⢿⢀⣀⠀⠹⣿⣿⣿⣦⣄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⠿⠀⠀⣟⡇⢘⣾⣽⠀⠀⡏⠉⠙⢛⣿⣷⡖⠀
⠀⠀⠀⠀⠀⣾⣿⣿⡿⠿⠷⠶⠤⠙⠒⠀⠒⢻⣿⣿⡷⠋⠀⠴⠞⠋⠁⢙⣿⣄
⠀⠀⠀⠀⢸⣿⣿⣯⣤⣤⣤⣤⣤⡄⠀⠀⠀⠀⠉⢹⡄⠀⠀⠀⠛⠛⠋⠉⠹⡇
⠀⠀⠀⠀⢸⣿⣿⠀⠀⠀⣀⣠⣤⣤⣤⣤⣤⣤⣤⣼⣇⣀⣀⣀⣛⣛⣒⣲⢾⡷
⢀⠤⠒⠒⢼⣿⣿⠶⠞⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀⣼⠃
⢮⠀⠀⠀⠀⣿⣿⣆⠀⠀⠻⣿⡿⠛⠉⠉⠁⠀⠉⠉⠛⠿⣿⣿⠟⠁⠀⣼⠃⠀
⠈⠓⠶⣶⣾⣿⣿⣿⣧⡀⠀⠈⠒⢤⣀⣀⡀⠀⠀⣀⣀⡠⠚⠁⠀⢀⡼⠃⠀⠀
⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⣷⣤⣤⣤⣤⣭⣭⣭⣭⣭⣥⣤⣤⣤⣴⣟⠁
`;
    }
    // Insert ASCII art into the editor
    const asciiDiv = document.createElement('div');
    asciiDiv.className = 'ascii-art';
    asciiDiv.textContent = art;
    const range = window.getSelection().getRangeAt(0);
    range.insertNode(asciiDiv);
    range.collapse(false);

    // Move the caret to the end of the inserted ASCII art
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}