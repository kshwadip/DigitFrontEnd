<script>

  let Fpanel, Spanel, Tpanel;
  let searchType,
      skipWhat = 0,
      numberOfUpWeeks = 5,
      numberOfDownWeeks = 5,
      value1, // market
      value2 = [], // day
      value3 = 0 , //n1
      value4 = 0, //n2
      dateInput1 = "00/00/00",
      dateInput2 = "00/00/00",
      dateInput3 = "00/00/00",
      fixedDate,
      turn = 0,
      matches = 3,
      errorMessage = "",
      showSkipSection = false;
  ///////////////////////////////////////////////////////////////////////////////////////
  let gridVisible = false,
      gridItems = [],
      mouseX = 0,
      mouseY = 0;
  //////////////////////////////////////////////////////////////////////////////////////
  let vectorN1 = [],
		vectorN2 = [],
		vectorN3 = [],
		vectors100 = [],
		expectedValues = [],
		OPPositions1 = [],
		OPPositions2 = [],
		OPPositions3 = [],
		CPPositions1 = [],
		CPPositions2 = [],
		CPPositions3 = [],
		MP1 = [],
    MP2 = [],
    MP3 = [];
      
  const weeks = ["Dates", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const fetchValues = async () => {
    try {
      const response = await fetch("/api/ReqVecs");

    if (!response.ok) {
      console.error("Failed to fetch vectors: ", response.statusText);
      return;  
    }
    vectors100 = await response.json();

    if (vectors100.length === 13) {
				[
					vectorN1,
					vectorN2,
					vectorN3,
					MP1,
					MP2,
					MP3,
					expectedValues,
					OPPositions1,
					OPPositions2,
					OPPositions3,
					CPPositions1,
					CPPositions2,
					CPPositions3
				] = vectors100;
			}

    } catch (error) {
      console.error("Error fetching vectors:", error);
    } 
  }; 

  const sendValues = async () => {
    const vectorData = {
      searchType: parseInt(searchType, 10),
      numberOfUpWeeks: parseInt(numberOfUpWeeks, 10),
      numberOfDownWeeks: parseInt(numberOfDownWeeks, 10),
      skipWhat: parseInt(skipWhat, 10),
      value1: parseInt(value1, 10),
      value2,
      value3: parseInt(value3, 10),
      value4: parseInt(value4, 10),
      dateInput1: dateInput1,
      dateInput2: dateInput2,
      dateInput3: dateInput3,
			fixedDate: parseInt(fixedDate, 10),
      turn: parseInt(turn, 10),
      matches: parseInt(matches, 10),
    };
    try {
      const response = await fetch("/api/ResVecs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vectorData),
      });
      if (!response.ok) {
        throw new Error("Failed to send vector data");
      }
      await fetchValues();
    } catch (error) {
      console.log(error);
    }
    showSkipSection = true;
  };

  function validateDate() {
    const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/(\d{2})$/;
    const isValidFormat1 = regex.test(dateInput1);
    const isValidFormat2 = regex.test(dateInput2);
    const isValidFormat3 = regex.test(dateInput3);

    if (dateInput1 && !isValidFormat1) {
      errorMessage = "Invalid date format for Date 1. Please use dd/mm/yy.";
      return;
    }

    if (dateInput2 && !isValidFormat2) {
      errorMessage = "Invalid date format for Date 2. Please use dd/mm/yy.";
      return;
    }

    if (dateInput3 && !isValidFormat3) {
      errorMessage = "Invalid date format for Date 3. Please use dd/mm/yy.";
      return;
    }

    function createDate(day, month, year) {
      if (parseInt(year) <= 99) {
        year = parseInt(year) >= 50 ? `19${year}` : `20${year}`;
      }
      return new Date(`${year}-${month}-${day}`);
    }

    if (isValidFormat1) {
      const [day1, month1, year1] = dateInput1.split("/");
      const date1 = createDate(day1, month1, year1);
      if (
        date1.getDate() !== parseInt(day1) ||
        date1.getMonth() + 1 !== parseInt(month1)
      ) {
        errorMessage = "Invalid Date 1. Please enter a valid date.";
        return;
      }
    }

    if (isValidFormat2) {
      const [day2, month2, year2] = dateInput2.split("/");
      const date2 = createDate(day2, month2, year2);
      if (
        date2.getDate() !== parseInt(day2) ||
        date2.getMonth() + 1 !== parseInt(month2)
      ) {
        errorMessage = "Invalid Date 2. Please enter a valid date.";
        return;
      }
    }

    if (isValidFormat3) {
      const [day3, month3, year3] = dateInput3.split("/");
      const date3 = createDate(day3, month3, year3);
      if (
        date3.getDate() !== parseInt(day3) ||
        date3.getMonth() + 1 !== parseInt(month3)
      ) {
        errorMessage = "Invalid Date 3. Please enter a valid date.";
        return;
      }
    }
    errorMessage = "";
  };

  const sendPattern = async () => {
		const numbers = {
			Fpanel: parseInt(Fpanel, 10),
			Spanel: parseInt(Spanel, 10)
		};
		try {
			const response = await fetch('/api/ReqPattern', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(numbers)
			});
			if (!response.ok) {
				throw new Error('Failed to send vector data');
			}
			const data = await response.json();
			Tpanel = data.data;
		} catch (error) {}
	};

  function findAndRemoveByRowCol(array, row, col) {
    for (let i = 0; i < array.length; i++) {
      const obj = array[i];
      if (obj.third !== 'E') continue;
      const hasMatch = (data) => {
        if (typeof data !== 'object' || data === null) return false;
        for (const key in data) {
          const value = data[key];
          if (typeof value === 'object' && value !== null) {
            if ('first' in value && 'second' in value) {
              if (value.first === row && value.second === col) {
                return true;
              }
            }
            if (hasMatch(value)) return true;
          }
        }
        return false;
      };

    if (hasMatch(obj)) {
      const parentFirst = obj.first ?? null;
      array.splice(i, 1); 
      return parentFirst < 10 ? '0' + parentFirst : String(parentFirst);
    }
    }
    return null; 
  };

  const setCellValue = (cellValue, rowIndex, colIndex, tableID) => {
      if (cellValue == 404) {
        return "✪"; 
      } else if (cellValue == 303) {
        if (vectors100.length === 13) {
          const result = findAndRemoveByRowCol(expectedValues, rowIndex, colIndex);
          return result;
        } else if (vectors100.length === 100 || searchType == 4 || searchType == 5) {
          let temp = vectors100[tableID][6];
          const result = findAndRemoveByRowCol(temp, rowIndex, colIndex);
          return result; 
        }
      }else {
        if (cellValue < 10) {
          return "0" + cellValue;
        } else {
          return cellValue;
        }
      }
  };

  const printdays = (colIndex) => {
    return weeks[colIndex];
  };

  const setColumnStyle = (rowIndex,colIndex,matchedPositions,OpanelPositions,CpanelPositions,tableID) => {
		let style = '';

		if (colIndex === 0 || colIndex === 1 || colIndex === 2) {
			// Dates columns
			style = `font-size: 20px; font-weight: bold; width: 1px; height: auto;`;
		} else if ([4, 7, 10, 13, 16, 19, 22].includes(colIndex)) {
			// Main columns
			style = `font-size: 25px; font-weight: bold; width: 1px; height: auto;`;

			let foundKey = new Array(21).fill(false);
			for (const p of matchedPositions) {
				const key = p.first;
				const { first: rowPos, second: colPos } = p.second;
				if (rowPos === rowIndex && colPos === colIndex) {
					if (key >= 0 && key <= 20) {
						foundKey[key] = true;
					}
				}
			}

			for (let key = 0; key < 21; ++key) {
				if (foundKey[key]) {
					switch (key) {
						case 0:
							style += 'color: #0000FF;';
							break; // E blue
						case 1:
							style += 'color: #00ff80;';
							break; // R light lime
						case 2:
							style += 'color: #000080;';
							break; // L navy blue
						case 3:
							style += 'color: #00FF00;';
							break; // D lime
						case 4:
							style += 'color: #FF00FF;';
							break; // U magenta
						case 5:
							style += 'color: #00FFFF;';
							break; // DR cyan
						case 6:
							style += 'color: #808000;';
							break; // DL olive
						case 7:
							style += 'color: #800000;';
							break; // UR maroon
						case 8:
							style += 'color: #FFA500;';
							break; // UL orange

						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

						case 9:
							style += 'background-color: #00ff80;';
							break; // light lime
						case 10:
							style += 'background-color: #000080;';
							break; // navy blue
						case 11:
							style += 'background-color: #00FF00;';
							break; // lime
						case 12:
							style += 'background-color: #FF00FF;';
							break; // magenta
						case 13:
							style += 'background-color: #00FFFF;';
							break; // cyan
						case 14:
							style += 'background-color: #808000;';
							break; // olive
						case 15:
							style += 'background-color: #800000;';
							break; // maroon
						case 16:
							style += 'background-color: #0000FF;';
							break; // blue
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						case 17:
							style += 'background-color: #00FFFF;';
							break; // cyan
						case 18:
							style += 'background-color: #808000;';
							break; // olive
						case 19:
							style += 'background-color: #800000;';
							break; // maroon
						case 20:
							style += 'background-color: #0000FF;';
							break; // blue
					}
					break; // Break after first match
				}
			}

		} else if ([3, 6, 9, 12, 15, 18, 21].includes(colIndex)) {
			// Left Side columns
			style = `font-size: 12px; writing-mode: vertical-lr; text-orientation: upright; width: 1px; height: 40px;`;
			let foundKey = new Array(21).fill(false);
			for (const p of OpanelPositions) {
				const key = p.first;
				const { first: rowPos, second: colPos } = p.second;
				if (rowPos === rowIndex && colPos === colIndex) {
					if (key >= 0 && key <= 20) {
						foundKey[key] = true;
					}
				}
			}

			for (let key = 0; key < 21; ++key) {
				if (foundKey[key]) {
					switch (key) {
						case 0:
							style += 'color: #FFF; background-color: #0000FF;';
							break; // E blue
						case 1:
							style += 'color: #FFF; background-color: #00ff80;';
							break; // R light lime
						case 2:
							style += 'color: #FFF; background-color: #FF99FF;';
							break; // L pink
						case 3:
							style += 'color: #FFF; background-color: #00FF00;';
							break; // D lime
						case 4:
							style += 'color: #FFF; background-color: #FF00FF;';
							break; // U magenta
						case 5:
							style += 'color: #FFF; background-color: #00FFFF;';
							break; // DR cyan
						case 6:
							style += 'color: #FFF; background-color: #808000;';
							break; // DL olive
						case 7:
							style += 'color: #FFF; background-color: #748DC6;';
							break; // UR coral blue
						case 8:
							style += 'color: #FFF; background-color: #FFA500;';
							break; // UL orange

						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

						case 9:
							style += 'color: #000; background-color: #00ff80;';
							break; // light lime
						case 10:
							style += 'color: #000; background-color: #FF99FF;';
							break; // pink
						case 11:
							style += 'color: #000; background-color: #00FF00;';
							break; // lime
						case 12:
							style += 'color: #000; background-color: #FF00FF;';
							break; // magenta
						case 13:
							style += 'color: #000; background-color: #00FFFF;';
							break; // cyan
						case 14:
							style += 'color: #000; background-color: #808000;';
							break; // olive
						case 15:
							style += 'color: #000; background-color: #748DC6;';
							break; // coral blue
						case 16:
							style += 'color: #000; background-color: #0000FF;';
							break; // blue
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						case 17:
							style += 'color: #000; background-color: #00FFFF;';
							break; // cyan
						case 18:
							style += 'color: #000; background-color: #808000;';
							break; // olive
						case 19:
							style += 'color: #000; background-color: #748DC6;';
							break; // coral blue
						case 20:
							style += 'color: #000; background-color: #0000FF;';
							break; // blue
					}
					break; // Break after first match
				}
			}

		} else if ([5, 8, 11, 14, 17, 20, 23].includes(colIndex)) {
			// Right Side columns
			style = `font-size: 12px; writing-mode: vertical-lr; text-orientation: upright; width: 1px; height: 40px;`;
			let foundKey = new Array(21).fill(false);
			for (const p of CpanelPositions) {
				const key = p.first;
				const { first: rowPos, second: colPos } = p.second;
				if (rowPos === rowIndex && colPos === colIndex) {
					if (key >= 0 && key <= 20) {
						foundKey[key] = true;
					}
				}
			}

			for (let key = 0; key < 21; ++key) {
				if (foundKey[key]) {
					switch (key) {
						case 0:
							style += 'color: #FFF; background-color: #0000FF;';
							break; // E blue
						case 1:
							style += 'color: #FFF; background-color: #FF0000;';
							break; // R red
						case 2:
							style += 'color: #FFF; background-color: #FF99FF;';
							break; // L pink
						case 3:
							style += 'color: #FFF; background-color: #00FF00;';
							break; // D lime
						case 4:
							style += 'color: #FFF; background-color: #FF00FF;';
							break; // U magenta
						case 5:
							style += 'color: #FFF; background-color: #00FFFF;';
							break; // DR cyan
						case 6:
							style += 'color: #FFF; background-color: #808000;';
							break; // DL olive
						case 7:
							style += 'color: #FFF; background-color: #748DC6;';
							break; // UR coral blue
						case 8:
							style += 'color: #FFF; background-color: #FFA500;';
							break; // UL orange

						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

						case 9:
							style += 'color: #000; background-color: #FF0000;';
							break; // red
						case 10:
							style += 'color: #000; background-color: #FF99FF;';
							break; // pink
						case 11:
							style += 'color: #000; background-color: #00FF00;';
							break; // lime
						case 12:
							style += 'color: #000; background-color: #FF00FF;';
							break; // magenta
						case 13:
							style += 'color: #000; background-color: #00FFFF;';
							break; // cyan
						case 14:
							style += 'color: #000; background-color: #808000;';
							break; // olive
						case 15:
							style += 'color: #000; background-color: #748DC6;';
							break; // coral blue
						case 16:
							style += 'color: #000; background-color: #0000FF;';
							break; // blue
						///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						case 17:
							style += 'color: #000; background-color: #00FFFF;';
							break; // cyan
						case 18:
							style += 'color: #000; background-color: #808000;';
							break; // olive
						case 19:
							style += 'color: #000; background-color: #748DC6;';
							break; // coral blue
						case 20:
							style += 'color: #000; background-color: #0000FF;';
							break; // blue
					}
					break; // Break after first match
				}
			}
		}

		return style;
	};

  const computedTop = () => {
    const gridHeight = 100; 
    const screenHeight = window.innerHeight;
    let topPosition = mouseY; 
    if (topPosition < gridHeight) {
      topPosition = gridHeight; 
    }
    const bottomPosition = topPosition + gridHeight;
    if (bottomPosition > screenHeight) {
      topPosition = screenHeight - gridHeight;
    }
    return topPosition - 30;
  };

  function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  };
  
  function handleMouseOver(cellValue,rowIndex, colIndex,tableID) {
    
    let index = tableID;
    if (vectors100.length === 13 && searchType != 4) {
      for (const p of expectedValues) {
        let key = p.first
        if (key < 10) {
          key = "0" + key;
        }
        let { first: rowPos, second: colPos } = p.second;
        let direction = p.third;
        if (cellValue == 303 && rowPos === rowIndex && colPos === colIndex) {
          if (direction == "DR") {
            gridItems.splice(0,1,key);
          }
          if (direction == "D") {
            gridItems.splice(1,1,key);
          }
          if (direction == "DL") {
            gridItems.splice(2,1,key);
          }
          if (direction == "R") {
            gridItems.splice(3,1,key);
          }
          if (direction == "E") {
            gridItems.splice(4,1,key);
          }
          if (direction == "L") {
            gridItems.splice(5,1,key);
          }
          if (direction == "UR") {
            gridItems.splice(6,1,key);
          }
          if (direction == "U") {
            gridItems.splice(7,1,key);
          }
          if (direction == "UL") {
            gridItems.splice(8,1,key);
          }
          gridVisible = true; 
        }
      }
    } 
    else if (vectors100.length === 100 || searchType == 4 || searchType == 5){
        let temp = vectors100[index][6];
        for (const p of temp) {
        let key = p.first
        if (key < 10) {
          key = "0" + key;
        }
        let { first: rowPos, second: colPos } = p.second;
        let direction = p.third;
        if (cellValue == 303 && rowPos === rowIndex && colPos === colIndex) {
          if (direction == "DR") {
            gridItems.splice(0,1,key);
          }
          if (direction == "D") {
            gridItems.splice(1,1,key);
          }
          if (direction == "DL") {
            gridItems.splice(2,1,key);
          }
          if (direction == "R") {
            gridItems.splice(3,1,key);
          }
          if (direction == "E") {
            gridItems.splice(4,1,key);
          }
          if (direction == "L") {
            gridItems.splice(5,1,key);
          }
          if (direction == "UR") {
            gridItems.splice(6,1,key);
          }
          if (direction == "U") {
            gridItems.splice(7,1,key);
          }
          if (direction == "UL") {
            gridItems.splice(8,1,key);
          }
          gridVisible = true; 
        }
      }
    }

  };
  
  function handleMouseOut() {
    gridVisible = false;
    gridItems = ["🕸️","🕸️","🕸️","🕸️","🕸️","🕸️","🕸️","🕸️","🕸️"];
  };

</script>

<main>

  <div>
    <h1>SATTAMATKA LINE ADDA</h1>
    <div id="container">
      <section id="pattern">
			<input type="number" bind:value={Fpanel} min="0" max="999" step="1" />
			<input type="number" bind:value={Spanel} min="0" max="999" step="1" />
			{#if Tpanel}
				<p>{Tpanel}</p>
			{/if}
			<button on:click={sendPattern}>click</button>
		</section>
    <form on:submit|preventDefault={sendValues}>
      <div>
        <label for="searchType">Select Search type</label>
        <select id="searchType" bind:value={searchType}>
          <option value="0" selected>Single Search</option>
          <option value="1">100 Search</option>
          <option value="2">Skip Search</option>
          <option value="3">Date Search</option>
          <option value="4">MT or EQ</option>
          <option value="5">MT_skip</option>
        </select>
      </div>
      <div>
        <label for="numberOfUWeeks">Select Number of Up Weeks</label>
        <input
        type="number"
        bind:value={numberOfUpWeeks}
        min="5"
        max="99"
        step="1"
      />
      </div>
      <div>
        <label for="numberOfDWeeks">Select Number of Down Weeks</label>
        <input
            type="number"
            bind:value={numberOfDownWeeks}
            min="5"
            max="99"
            step="1"
          />
      </div>
      <section id="skip">
        {#if showSkipSection && searchType == 2}
        <div>
          <h4>Skip 3</h4>
          <input
            type="checkbox"
            id="exampleRadio2"
            name="example"
            value="3"
            bind:group={skipWhat}
          />
        </div>

          <div>
            <h4>Skip 2</h4>
            <input
              type="checkbox"
              id="exampleRadio1"
              name="example"
              value="2"
              bind:group={skipWhat}
            />
          </div>

          <div>
            <h4>Skip 1</h4>
            <input
              type="checkbox"
              id="exampleRadio0"
              name="example"
              value="1"
              bind:group={skipWhat}
            />
          </div>

          <div>
						<h4>fixed</h4>
						<input type="checkbox" id="exampleRadio0" name="example" value="0" bind:group={fixedDate} />
					</div>
        {/if}
        {#if searchType == 4 || searchType == 5}
        {#if searchType == 4}
        <label for="numberOfUWeeks" style="margin-bottom: 10px;">Select Number of Skips</label>
        <input type="number" bind:value={turn} min="0" max="100" step="1"/>
        {/if}
        <label for="numberOfUWeeks" style="margin-bottom: 10px;">Select Number of Matches</label>
        <input type="number" bind:value={matches} min="2" max="100" step="1"/>
        {/if}
      </section>
      <div>
        <label for="value1">Market</label>
        <select id="value1" bind:value={value1}>
          <option value="0" selected>Kalyan</option>
          <option value="1">Main Bazar</option>
          <option value="2">Kalyan Night</option>
          <option value="3">Time Bazar</option>
          <option value="4">Milan Day</option>
          <option value="5">Milan Night</option>
          <option value="6">Rajdhani Day</option>
          <option value="7">Rajdhani Night</option>
          <option value="8">Padamawati</option>
        </select>
      </div>
      <div>
        <label for="value2">N1</label>
        <select id="value2" bind:value={value2[0]}>
          <option value="0" selected>Monday</option>
          <option value="1">Tuesday</option>
          <option value="2">Wednesday</option>
          <option value="3">Thursday</option>
          <option value="4">Friday</option>
          <option value="5">Saturday</option>
          <option value="6">Sunday</option>
        </select>

        <label for="value2">N2</label>
        <select id="value2" bind:value={value2[1]}>
          <option value="0" selected>Monday</option>
          <option value="1">Tuesday</option>
          <option value="2">Wednesday</option>
          <option value="3">Thursday</option>
          <option value="4">Friday</option>
          <option value="5">Saturday</option>
          <option value="6">Sunday</option>
        </select>

        <label for="value2">N3</label>
        <select id="value2" bind:value={value2[2]}>
          <option value="0" selected>Monday</option>
          <option value="1">Tuesday</option>
          <option value="2">Wednesday</option>
          <option value="3">Thursday</option>
          <option value="4">Friday</option>
          <option value="5">Saturday</option>
          <option value="6">Sunday</option>
        </select>
      </div>
      {#if searchType == 3}
        <div>
          <label for="date">Enter date 1(dd/mm/yy):</label>
          <input
            type="text"
            id="date"
            bind:value={dateInput1}
            on:input={validateDate}
            placeholder="dd/mm/yy"
          />
        </div>
        <div>
          <label for="date">Enter date 2(dd/mm/yy):</label>
          <input
            type="text"
            id="date"
            bind:value={dateInput2}
            on:input={validateDate}
            placeholder="dd/mm/yy"
          />
        </div>
        <div>
          <label for="date">Enter date 3(dd/mm/yy):</label>
          <input
            type="text"
            id="date"
            bind:value={dateInput3}
            on:input={validateDate}
            placeholder="dd/mm/yy"
          />
        </div>
        {#if errorMessage}
          <p style="color: red;">{errorMessage}</p>
        {/if}
      {/if}
      {#if searchType != 3}
        <div>
          <label for="value3">Number 1</label>
          <input
            type="number"
            id="value3"
            bind:value={value3}
            min="0"
            max="99"
            step="1"
          />
        </div>
        <div>
          <label for="value4">Number 2</label>
          <input
            type="number"
            id="value4"
            bind:value={value4}
            min="0"
            max="99"
            step="1"
          />
        </div>
      {/if}
      <button type="submit">Search Values</button>
    </form>
  </div>
  </div>
 
  {#if vectors100.length === 13 && searchType != 4}
    <!-- Table for Vector N3 -->
    <section id="Grids">
      <table on:mousemove={handleMouseMove}>
        <thead>
          <tr>
            {#each Array((vectorN3[0].length === 18 ? 6 : 0) || (vectorN3[0].length === 21 ? 7 : 0) || (vectorN3[0].length === 24 ? 8 : 0)) as _, colIndex}
              <th colspan="3">{printdays(colIndex)}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each vectorN3 as row, rowIndex}
            <tr>
              {#each row as value, colIndex}
              <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                <td on:mouseover={() => handleMouseOver(value,rowIndex,colIndex,0)} on:mouseout={handleMouseOut} style={setColumnStyle(rowIndex, colIndex, MP3, OPPositions3, CPPositions3,0)}>
                  {setCellValue(value, rowIndex, colIndex,0)}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>

      <!-- Table for Vector N2 -->
      <table on:mousemove={handleMouseMove}>
        <thead>
          <tr>
            {#each Array((vectorN2[0].length === 18 ? 6 : 0) || (vectorN2[0].length === 21 ? 7 : 0) || (vectorN2[0].length === 24 ? 8 : 0)) as _, colIndex}
              <th colspan="3">{printdays(colIndex)}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each vectorN2 as row, rowIndex}
            <tr>
              {#each row as value, colIndex}
              <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                <td on:mouseover={() => handleMouseOver(value,rowIndex,colIndex,1)} on:mouseout={handleMouseOut} style={setColumnStyle(rowIndex, colIndex, MP2, OPPositions2, CPPositions2,1)}>
                  {setCellValue(value, rowIndex, colIndex,0)}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>

      <!-- Table for Vector N1-->
      <table on:mousemove={handleMouseMove}>
        <thead>
          <tr>
            {#each Array((vectorN1[0].length === 18 ? 6 : 0) || (vectorN1[0].length === 21 ? 7 : 0) || (vectorN1[0].length === 24 ? 8 : 0)) as _, colIndex}
              <th colspan="3">{printdays(colIndex)}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each vectorN1 as row, rowIndex}
            <tr>
              {#each row as value, colIndex}
              <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                 <td on:mouseover={() => handleMouseOver(value,rowIndex,colIndex,2)} on:mouseout={handleMouseOut} style={setColumnStyle(rowIndex, colIndex, MP1, OPPositions1, CPPositions1)}> 
                  {setCellValue(value, rowIndex, colIndex,0)}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </section>
    
  {:else if vectors100.length === 100 || searchType == 4 || searchType == 5}
    <section id="Grids">
      {#each vectors100 as element, index}
        <!-- Table for element[2] (formerly vectorN3) -->
        <table on:mousemove={handleMouseMove}>
          <thead>
            <tr>
              {#each Array((element[2][0].length === 18 ? 6 : 0) || (element[2][0].length === 21 ? 7 : 0) || (element[2][0].length === 24 ? 8 : 0)) as _, colIndex}
                <th colspan="3">{printdays(colIndex)}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each element[2] as row, rowIndex}
              <tr>
                {#each row as value, colIndex}
                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                  <td on:mouseover={() => handleMouseOver(value,rowIndex,colIndex,index)} on:mouseout={handleMouseOut} style={setColumnStyle(rowIndex, colIndex, element[5], element[9], element[12],index)}>
                    {setCellValue(value,rowIndex,colIndex,index)}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>

        <!-- Table for element[1] (formerly vectorN2) -->
        <table on:mousemove={handleMouseMove}>
          <thead>
            <tr>
              {#each Array((element[1][0].length === 18 ? 6 : 0) || (element[1][0].length === 21 ? 7 : 0) || (element[1][0].length === 24 ? 8 : 0)) as _, colIndex}
                <th colspan="3">{printdays(colIndex)}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each element[1] as row, rowIndex}
              <tr>
                {#each row as value, colIndex}
                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                  <td on:mouseover={() => handleMouseOver(value,rowIndex,colIndex,index)} on:mouseout={handleMouseOut} style={setColumnStyle(rowIndex, colIndex, element[4], element[8], element[11],index)}>
                    {setCellValue(value,rowIndex,colIndex,index)}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>

        <!-- Table for element[0] (formerly vectorN1) -->
        <table on:mousemove={handleMouseMove}>
          <thead>
            <tr>
              {#each Array((element[0][0].length === 18 ? 6 : 0) || (element[0][0].length === 21 ? 7 : 0) || (element[0][0].length === 24 ? 8 : 0)) as _, colIndex}
                <th colspan="3">{printdays(colIndex)}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each element[0] as row, rowIndex}
              <tr>
                {#each row as value, colIndex}
                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                  <td on:mouseover={() => handleMouseOver(value,rowIndex,colIndex,index)} on:mouseout={handleMouseOut} style={setColumnStyle(rowIndex, colIndex, element[3], element[7], element[10])}>
                    {setCellValue(value,rowIndex,colIndex,index)}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table> 
      {/each}
    </section>  
  {:else}
    <p>Click Search Values Button</p>
  {/if}

  {#if gridVisible}
  <div class="grid-container" style="top:{computedTop()}px; left: {mouseX - 150}px;">
    {#each gridItems as item}
      <div class="grid-item">{item}</div>
    {/each}
  </div>
  {/if}

</main>

<style>
   main {
    font-family: Arial, sans-serif;
    text-align: center;
    background-color: aquamarine;
  }

  #container {
		display: grid;
		grid-template-columns: 1% 100%;
		justify-content: center;
		align-items: center;
	}

	#pattern {
		margin-left: 190px;
	}

  h1 {
    position: fixed;
    top: 0;
    left: 5;
    padding: 5px;
    background-color: rgb(19 25 229);
    color: rgb(0 255 34);
    text-shadow: 2px 2px 0px rgba(255, 0, 0, 1);
  }

  #Grids {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    position: relative;
  }

  table {
    border-collapse: collapse;
    background-color: rgb(255, 255, 255);
    margin-bottom: 2%;
  }

  thead {
    color: #ff0000;
  }

  th,
  td {
    border: 1px solid rgb(255, 111, 0);
    text-align: center;
    cursor: pointer;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  #skip {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }

  form {
    margin-top: 20px;
    margin-left: 45%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  div {
    margin-bottom: 10px;
  }

  button {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
  }

  button:hover {
    background-color: #45a049;
  }

  .grid-container{
    display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      grid-gap: 5px;
      justify-items: center;
      padding: 5px;
      background-color: rgba(0, 0, 0, 0.5);
      color: #FFFF00;
      position: fixed;
      z-index: 1000;
      border-radius: 10px;
  }

  .grid-item {
        font-size: 20px;
        padding: 2px;
        text-align: center;
        background-color: #555;
        border-radius: 5px;
    }

</style>
