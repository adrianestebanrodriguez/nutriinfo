const nutritionalData = {
    "Harina de maíz": { energia: 347, proteina: 8.8, lipidos: 0.8, grasas_saturadas: 0, grasas_trans: 0, carbohidratos: 76, azucares: 1, sodio: 0 },
    "Carne de cerdo": { energia: 131, proteina: 20.5, lipidos: 5.4, grasas_saturadas: 1.9, grasas_trans: 0, carbohidratos: 0.2, azucares: 0, sodio: 57 },
    "Zanahoria": { energia: 47, proteina: 0.7, lipidos: 0.1, grasas_saturadas: 0, grasas_trans: 0, carbohidratos: 9.5, azucares: 4.7, sodio: 35 },
    "Papa": { energia: 74, proteina: 1.9, lipidos: 0.1, grasas_saturadas: 0, grasas_trans: 0, carbohidratos: 15.3, azucares: 13.3, sodio: 11 },
    "Huevo": { energia: 145, proteina: 13, lipidos: 10.4, grasas_saturadas: 3.1, grasas_trans: 0, carbohidratos: 0, azucares: 0, sodio: 143 },
    "Guisantes": { energia: 81, proteina: 5.4, lipidos: 0.4, grasas_saturadas: 0.1, grasas_trans: 0, carbohidratos: 14.5, azucares: 5.7, sodio: 5 },
    "Aceite vegetal": { energia: 884, proteina: 0, lipidos: 100, grasas_saturadas: 14, grasas_trans: 2, carbohidratos: 0, azucares: 0, sodio: 0 },
    "Sal": { energia: 0, proteina: 0, lipidos: 0, grasas_saturadas: 0, grasas_trans: 0, carbohidratos: 0, azucares: 0, sodio: 38758 },
    "Condimentos": { energia: 250, proteina: 5, lipidos: 6, grasas_saturadas: 1, grasas_trans: 0, carbohidratos: 50, azucares: 20, sodio: 1200 }
};

// Función para agregar ingredientes a la tabla
document.getElementById("add-ingredient").addEventListener("click", () => {
    const ingredient = document.getElementById("ingredient").value;
    const quantity = parseFloat(document.getElementById("quantity").value);

    if (ingredient && quantity > 0) {
        const tableBody = document.querySelector("#ingredient-table tbody");
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td>${ingredient}</td>
            <td>${quantity}</td>
            <td><button class="delete-btn">X</button></td>
        `;

        tableBody.appendChild(newRow);

        // Limpiar los campos después de agregar
        document.getElementById("ingredient").value = "";
        document.getElementById("quantity").value = "";

        // Agregar evento a los botones de eliminar
        newRow.querySelector(".delete-btn").addEventListener("click", function () {
            newRow.remove();
        });
    } else {
        alert("Por favor, ingrese un ingrediente y una cantidad válida.");
    }
});

// Función para calcular la tabla nutricional
document.getElementById("calculate-nutrition").addEventListener("click", () => {
    let totalNutrients = { energia: 0, proteina: 0, lipidos: 0, grasas_saturadas: 0, grasas_trans: 0, carbohidratos: 0, azucares: 0, sodio: 0 };
    let totalWeight = 0;
    const rows = document.querySelectorAll("#ingredient-table tbody tr");

    rows.forEach(row => {
        const ingredient = row.cells[0].innerText;
        const quantity = parseFloat(row.cells[1].innerText);
        totalWeight += quantity;
        if (nutritionalData[ingredient]) {
            Object.keys(totalNutrients).forEach(key => {
                totalNutrients[key] += (nutritionalData[ingredient][key] * quantity) / 100;
            });
        }
    });

    if (totalWeight === 0) {
        alert("Agregue al menos un ingrediente antes de calcular.");
        return;
    }

    const portionSize = parseFloat(document.getElementById("portion-size").value);
    const factor = portionSize / totalWeight;
    Object.keys(totalNutrients).forEach(key => totalNutrients[key] *= factor);

    displayNutritionTable(totalNutrients, portionSize);
    checkWarnings(totalNutrients);
});

// Función para mostrar la tabla nutricional
function displayNutritionTable(nutrients, portionSize) {
    document.getElementById("nutrition-table").innerHTML = `
        <h2>Tabla Nutricional por ${portionSize}g</h2>
        <table>
            <tr><td>Energía</td><td>${nutrients.energia.toFixed(2)} kcal</td></tr>
            <tr><td>Proteína</td><td>${nutrients.proteina.toFixed(2)} g</td></tr>
            <tr><td>Grasas Totales</td><td>${nutrients.lipidos.toFixed(2)} g</td></tr>
            <tr><td>Grasas Saturadas</td><td>${nutrients.grasas_saturadas.toFixed(2)} g</td></tr>
            <tr><td>Grasas Trans</td><td>${nutrients.grasas_trans.toFixed(2)} g</td></tr>
            <tr><td>Carbohidratos</td><td>${nutrients.carbohidratos.toFixed(2)} g</td></tr>
            <tr><td>Azúcares</td><td>${nutrients.azucares.toFixed(2)} g</td></tr>
            <tr><td>Sodio</td><td>${nutrients.sodio.toFixed(2)} mg</td></tr>
        </table>
    `;
}

// Función para verificar advertencias nutricionales
function checkWarnings(nutrients) {
    let warnings = [];
    if (nutrients.sodio >= 300) warnings.push("ALTO EN SODIO");
    if (nutrients.grasas_saturadas >= 10) warnings.push("ALTO EN GRASAS SATURADAS");
    if (nutrients.grasas_trans >= 1) warnings.push("ALTO EN GRASAS TRANS");
    if (nutrients.azucares >= 10) warnings.push("ALTO EN AZÚCARES AÑADIDOS");

    document.getElementById("warning-labels").innerHTML = warnings.length 
        ? `<h2>Sellos de advertencia:</h2><ul><li class="warning">${warnings.join("</li><li class='warning'>")}</li></ul>` 
        : "<h2>Sin sellos de advertencia</h2>";
}
