window.onload = function() {
    loadRanking();
};

function loadRanking() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || {};
    const rankingArray = Object.entries(ranking).sort((a, b) => b[1] - a[1]);
    const rankingTable = document.getElementById('rankingTable').getElementsByTagName('tbody')[0];
    rankingTable.innerHTML = '';

    rankingArray.forEach(([nomeAluno, count], index) => {
        const newRow = rankingTable.insertRow();
        newRow.insertCell(0).textContent = index + 1; // Posição no ranking
        newRow.insertCell(1).textContent = nomeAluno;
        newRow.insertCell(2).textContent = count;
    });
}
