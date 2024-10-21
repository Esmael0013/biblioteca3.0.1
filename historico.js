function addToHistorico(emprestimo) {
    const table = document.getElementById('historicoTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.insertCell(0).textContent = emprestimo.nomeAluno;
    newRow.insertCell(1).textContent = emprestimo.numeroCGM;
    newRow.insertCell(2).textContent = emprestimo.nomeLivro;
    newRow.insertCell(3).textContent = emprestimo.numeroLivro;
    newRow.insertCell(4).textContent = emprestimo.dataEntrega;
}

function loadHistoricoFromLocalStorage() {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    historico.forEach(emprestimo => addToHistorico(emprestimo));
}

window.onload = function() {
    loadFromLocalStorage();
    loadHistoricoFromLocalStorage();
};
document.getElementById('historicoSearchInput').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const table = document.getElementById('historicoTable').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    Array.from(rows).forEach(row => {
        const nomeAlunoCell = row.getElementsByTagName('td')[0];
        const numeroTurmaCell = row.getElementsByTagName('td')[1];
        const nomeLivroCell = row.getElementsByTagName('td')[3];
        if (nomeAlunoCell && numeroTurmaCell && nomeLivroCell) {
            const alunoText = nomeAlunoCell.textContent.toLowerCase();
            const turmaText = numeroTurmaCell.textContent.toLowerCase();
            const livroText = nomeLivroCell.textContent.toLowerCase();
            if (alunoText.includes(searchValue) || turmaText.includes(searchValue) || livroText.includes(searchValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
});

window.onload = function() {
    loadFromLocalStorage();
    loadHistoricoFromLocalStorage();
    sortTableByDate();
    highlightOverdue();
};
