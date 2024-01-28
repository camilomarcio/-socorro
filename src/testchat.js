// é so um codigo para simular como ficaria resposta do chat por exemplo
function search() {
    var userInput = document.getElementById("searchInput").value.toLowerCase();
    var instructions;
    if (userInput.includes("ferimento")) {
        instructions = "1. Lave a área afetada com água limpa.\n2. Aplique um curativo estéril.\n3. Procure ajuda médica se necessário.";
    } else if (userInput.includes("engasgado")) {
        instructions = "1. Mantenha a calma.\n2. Encoraje a pessoa a tossir.\n3. Se a pessoa não conseguir respirar, chame ajuda imediatamente e inicie a manobra de Heimlich.";
    } else {
        instructions = "Instruções gerais para situações de emergência.";
    }

    var instructionsElement = document.getElementById("instructions");
    instructionsElement.innerHTML = "<p>Instruções:</p><pre>" + instructions + "</pre>";
}

// tira o codigo comentado do chat.css para ver ele estilizado