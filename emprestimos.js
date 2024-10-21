document.getElementById('emprestimoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (validateForm()) {
        addEmprestimo();
    }
});

function validateForm() {
    const nomeAluno = document.getElementById('nomeAluno').value.trim();
    const numeroAluno = document.getElementById('numeroAluno').value.trim();
    const numeroCGM = document.getElementById('numeroCGM').value.trim();
    const nomeLivro = document.getElementById('nomeLivro').value.trim();
    const numeroLivro = document.getElementById('numeroLivro').value.trim();
    const dataEntrega = document.getElementById('dataEntrega').value.trim();

    if (!nomeAluno || !numeroAluno || !numeroCGM || !nomeLivro || !numeroLivro || !dataEntrega) {
        alert('Por favor, preencha todos os campos.');
        return false;
    }
    return true;
}

function addEmprestimo() {
    const nomeAluno = document.getElementById('nomeAluno').value;
    const numeroAluno = document.getElementById('numeroAluno').value;
    const numeroCGM = document.getElementById('numeroCGM').value;
    const nomeLivro = document.getElementById('nomeLivro').value;
    const numeroLivro = document.getElementById('numeroLivro').value;
    const dataEntrega = document.getElementById('dataEntrega').value;

    if (isCGMWithActiveEmprestimo(numeroCGM)) {
        alert('Este aluno já possui um empréstimo ativo.');
        return;
    }

    const table = document.getElementById('emprestimosTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.insertCell(0).textContent = nomeAluno;
    newRow.insertCell(1).textContent = numeroAluno;
    newRow.insertCell(2).textContent = numeroCGM;
    newRow.insertCell(3).textContent = nomeLivro;
    newRow.insertCell(4).textContent = numeroLivro;
    newRow.insertCell(5).textContent = dataEntrega;
    const devolverBtn = document.createElement('button');
    devolverBtn.textContent = 'Devolver';
    devolverBtn.onclick = function() {
        moveToHistorico(newRow);
        saveToLocalStorage();
    };
    newRow.insertCell(6).appendChild(devolverBtn);

    saveToLocalStorage();
    sortTableByDate();
    highlightOverdue();
    document.getElementById('emprestimoForm').reset();
}

function isCGMWithActiveEmprestimo(numeroCGM) {
    const table = document.getElementById('emprestimosTable').getElementsByTagName('tbody')[0];
    const rows = Array.from(table.getElementsByTagName('tr'));
    return rows.some(row => row.cells[2].textContent === numeroCGM);
}

function saveToLocalStorage() {
    const table = document.getElementById('emprestimosTable').getElementsByTagName('tbody')[0];
    const rows = Array.from(table.getElementsByTagName('tr'));
    const emprestimos = rows.map(row => {
        return {
            nomeAluno: row.cells[0].textContent,
            numeroAluno: row.cells[1].textContent,
            numeroCGM: row.cells[2].textContent,
            nomeLivro: row.cells[3].textContent,
            numeroLivro: row.cells[4].textContent,
            dataEntrega: row.cells[5].textContent
        };
    });
    localStorage.setItem('emprestimos', JSON.stringify(emprestimos));

    const historicoTable = document.getElementById('historicoTable').getElementsByTagName('tbody')[0];
    const historicoRows = Array.from(historicoTable.getElementsByTagName('tr'));
    const historico = historicoRows.map(row => {
        return {
            nomeAluno: row.cells[0].textContent,
            numeroAluno: row.cells[1].textContent,
            numeroCGM: row.cells[2].textContent,
            nomeLivro: row.cells[3].textContent,
            numeroLivro: row.cells[4].textContent,
            dataEntrega: row.cells[5].textContent
        };
    });
    localStorage.setItem('historico', JSON.stringify(historico));
}

function loadFromLocalStorage() {
    const emprestimos = JSON.parse(localStorage.getItem('emprestimos')) || [];
    const table = document.getElementById('emprestimosTable').getElementsByTagName('tbody')[0];
    emprestimos.forEach(emprestimo => {
        const newRow = table.insertRow();
        newRow.insertCell(0).textContent = emprestimo.nomeAluno;
        newRow.insertCell(1).textContent = emprestimo.numeroAluno;
        newRow.insertCell(2).textContent = emprestimo.numeroCGM;
        newRow.insertCell(3).textContent = emprestimo.nomeLivro;
        newRow.insertCell(4).textContent = emprestimo.numeroLivro;
        newRow.insertCell(5).textContent = emprestimo.dataEntrega;
        const devolverBtn = document.createElement('button');
        devolverBtn.textContent = 'Devolver';
        devolverBtn.onclick = function() {
            moveToHistorico(newRow);
            saveToLocalStorage();
        };
        newRow.insertCell(6).appendChild(devolverBtn);
    });

    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    const historicoTable = document.getElementById('historicoTable').getElementsByTagName('tbody')[0];
    historico.forEach(emprestimo => {
        const newRow = historicoTable.insertRow();
        newRow.insertCell(0).textContent = emprestimo.nomeAluno;
        newRow.insertCell(1).textContent = emprestimo.numeroAluno;
        newRow.insertCell(2).textContent = emprestimo.numeroCGM;
        newRow.insertCell(3).textContent = emprestimo.nomeLivro;
        newRow.insertCell(4).textContent = emprestimo.numeroLivro;
        newRow.insertCell(5).textContent = emprestimo.dataEntrega;
    });

    sortTableByDate();
    highlightOverdue();
}

function moveToHistorico(row) {
    const historicoTable = document.getElementById('historicoTable').getElementsByTagName('tbody')[0];
    const newRow = historicoTable.insertRow();
    newRow.insertCell(0).textContent = row.cells[0].textContent;
    newRow.insertCell(1).textContent = row.cells[1].textContent;
    newRow.insertCell(2).textContent = row.cells[2].textContent;
    newRow.insertCell(3).textContent = row.cells[3].textContent;
    newRow.insertCell(4).textContent = row.cells[4].textContent;
    newRow.insertCell(5).textContent = row.cells[5].textContent;
    row.remove();
    saveToLocalStorage();
}

function sortTableByDate() {
    const table = document.getElementById('emprestimosTable').getElementsByTagName('tbody')[0];
    const rows = Array.from(table.getElementsByTagName('tr'));
    rows.sort((a, b) => {
        const dateA = new Date(a.cells[5].textContent);
        const dateB = new Date(b.cells[5].textContent);
        return dateA - dateB;
    });
    rows.forEach(row => table.appendChild(row));
}

function highlightOverdue() {
    const table = document.getElementById('emprestimosTable').getElementsByTagName('tbody')[0];
    const rows = Array.from(table.getElementsByTagName('tr'));
    const today = new Date();
    rows.forEach(row => {
        const dueDate = new Date(row.cells[5].textContent);
        if (dueDate < today) {
            row.style.backgroundColor = '#D32F2F'; // Vermelho coral
        }
    });
}

window.onload = function() {
    loadFromLocalStorage();
    sortTableByDate();
    highlightOverdue();
};

// Função para exportar os dados em formato JSON
function exportData() {
    const emprestimos = JSON.parse(localStorage.getItem('emprestimos')) || [];
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    const data = { emprestimos, historico };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "biblioteca.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove}

// Função para importar dados em formato JSON
function importData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        const emprestimos = JSON.parse(localStorage.getItem('emprestimos')) || [];
        const historico = JSON.parse(localStorage.getItem('historico')) || [];

        const newEmprestimos = data.emprestimos.filter(newEmprestimo => {
            return !emprestimos.some(existingEmprestimo => 
                existingEmprestimo.numeroCGM === newEmprestimo.numeroCGM && 
                existingEmprestimo.nomeLivro === newEmprestimo.nomeLivro &&
                existingEmprestimo.numeroAluno === newEmprestimo.numeroAluno
            );
        });

        const newHistorico = data.historico.filter(newHistorico => {
            return !historico.some(existingHistorico => 
                existingHistorico.numeroCGM === newHistorico.numeroCGM && 
                existingHistorico.nomeLivro === newHistorico.nomeLivro &&
                existingHistorico.numeroAluno === newHistorico.numeroAluno
            );
        });

        localStorage.setItem('emprestimos', JSON.stringify([...emprestimos, ...newEmprestimos]));
        localStorage.setItem('historico', JSON.stringify([...historico, ...newHistorico]));
        location.reload(); // Recarregar a página para exibir os novos dados
    };
    reader.readAsText(file);
}

// Função de pesquisa
document.getElementById('searchInput').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const table = document.getElementById('emprestimosTable').getElementsByTagName('tbody')[0];
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
    sortTableByDate();
    highlightOverdue();
};
