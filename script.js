// script.js - GeoJSON Map Editor with FontAwesome marker icons

// ==== Configuration ==== //
const AMAP_API_KEY = '高德地图API';
const AMAP_GEOCODE_URL = 'https://restapi.amap.com/v3/geocode/geo';

// ==== Initialize Map ==== //
const map = L.map('map').setView([36.0671, 120.3826], 12); // 青岛市中心

// Base layers
const baseLayers = {
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
    }),
    stamen: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
        attribution: '&copy; Stamen Design',
        maxZoom: 20,
    }),
    carto: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
        maxZoom: 19,
    }),
};
baseLayers.osm.addTo(map);

// ==== FontAwesome Icon Marker System ==== //
// Map marker-symbol values to FontAwesome icon classes
const iconClassMap = {
    'car': 'fa-solid fa-car',
    'vehicle': 'fa-solid fa-car',
    'shop': 'fa-solid fa-bag-shopping',
    'store': 'fa-solid fa-bag-shopping',
    'fuel': 'fa-solid fa-gas-pump',
    'gas_station': 'fa-solid fa-gas-pump',
    'warehouse': 'fa-solid fa-warehouse',
    'building': 'fa-solid fa-warehouse',
    'default': 'fa-solid fa-location-dot'
};

// Create custom marker icon with FontAwesome
function createCustomMarkerIcon(color, symbol) {
    // Default to blue if color not provided or invalid
    if (!color || color.indexOf('#') !== 0) {
        color = '#4a90e2'; // default blue
    }

    // Get FontAwesome icon class
    const iconClass = iconClassMap[symbol] || iconClassMap['default'];

    // Create HTML with circular background and FontAwesome icon
    // Create HTML with circular background and FontAwesome icon
    const html = `
        <div class="custom-marker-wrapper">
            <div class="custom-marker-circle" style="background-color: ${color};">
                <i class="${iconClass}"></i>
            </div>
            <div class="custom-marker-tip" style="border-top-color: ${color};"></div>
        </div>
    `;

    return L.divIcon({
        html: html,
        className: 'custom-marker-icon',
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -42]
    });
}

// Determine icon based on feature properties
function getMarkerIcon(properties) {
    let color = '#4a90e2'; // default blue
    let symbol = 'default';

    if (properties) {
        // Read marker-color (hex color like #00AA00)
        if (properties['marker-color']) {
            color = properties['marker-color'];
            // If it's a named color, convert to hex
            if (color.indexOf('#') !== 0) {
                const colorMap = {
                    'blue': '#4a90e2',
                    'red': '#e74c3c',
                    'green': '#2ecc71',
                    'orange': '#f39c12',
                    'yellow': '#f1c40f',
                    'violet': '#9b59b6',
                    'purple': '#800080',
                    'grey': '#95a5a6',
                    'black': '#2c3e50'
                };
                color = colorMap[color.toLowerCase()] || '#4a90e2';
            }
        }

        // Read marker-symbol or type
        if (properties['marker-symbol']) {
            symbol = properties['marker-symbol'];
        } else if (properties.type) {
            const type = properties.type.toLowerCase();
            const symbolMap = {
                'shop': 'shop',
                'store': 'shop',
                '商店': 'shop',
                '快准服务站': 'shop',
                'warehouse': 'warehouse',
                'building': 'warehouse',
                '仓库': 'warehouse',
                '新康众服务站': 'warehouse',
                'fuel': 'fuel',
                'gas_station': 'fuel',
                '加油站': 'fuel',
                '汽服门店': 'fuel',
                'car': 'car',
                'vehicle': 'car',
                '汽车': 'car',
                '优配服务站': 'car'
            };

            if (symbolMap[type]) {
                symbol = symbolMap[type];
            } else {
                // Substring match
                for (const key in symbolMap) {
                    if (type.includes(key)) {
                        symbol = symbolMap[key];
                        break;
                    }
                }
            }
        }
    }

    return createCustomMarkerIcon(color, symbol);
}

// ==== Leaflet.draw Setup ==== //
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

L.drawLocal = {
    draw: {
        toolbar: {
            actions: { title: '取消绘制', text: '取消' },
            finish: { title: '完成绘制', text: '完成' },
            undo: { title: '删除最后一个点', text: '删除最后一个点' },
            buttons: {
                polyline: '绘制折线',
                polygon: '绘制多边形',
                rectangle: '绘制矩形',
                circle: '绘制圆形',
                marker: '添加标记',
                circlemarker: '添加圆形标记'
            }
        },
        handlers: {
            circle: { tooltip: { start: '点击并拖动绘制圆形' }, radius: '半径' },
            circlemarker: { tooltip: { start: '点击地图放置圆形标记' } },
            marker: { tooltip: { start: '点击地图放置标记' } },
            polygon: { tooltip: { start: '点击开始绘制多边形', cont: '点击继续绘制多边形', end: '点击第一个点完成多边形' } },
            polyline: { error: '<strong>错误:</strong> 线段不能交叉!', tooltip: { start: '点击开始绘制折线', cont: '点击继续绘制折线', end: '点击最后一个点完成折线' } },
            rectangle: { tooltip: { start: '点击并拖动绘制矩形' } },
            simpleshape: { tooltip: { end: '释放鼠标完成绘制' } }
        }
    },
    edit: {
        toolbar: {
            actions: { save: { title: '保存更改', text: '保存' }, cancel: { title: '取消编辑，放弃所有更改', text: '取消' }, clearAll: { title: '清除所有图层', text: '全部清除' } },
            buttons: { edit: '编辑图层', editDisabled: '没有可编辑的图层', remove: '删除图层', removeDisabled: '没有可删除的图层' }
        },
        handlers: { edit: { tooltip: { text: '拖动控制点或标记来编辑要素', subtext: '点击取消撤销更改' } }, remove: { tooltip: { text: '点击要删除的要素' } } }
    }
};

const drawControl = new L.Control.Draw({
    position: 'topleft',
    draw: {
        polyline: { shapeOptions: { color: '#00ff00', weight: 3 } },
        polygon: { allowIntersection: false, shapeOptions: { color: '#ff7800', fillOpacity: 0.3 } },
        rectangle: { shapeOptions: { color: '#ff7800', fillOpacity: 0.3 } },
        circle: { shapeOptions: { color: '#ff7800', fillOpacity: 0.2 } },
        marker: true,
        circlemarker: false
    },
    edit: { featureGroup: drawnItems, remove: true }
});
map.addControl(drawControl);

// ==== UI Elements ==== //
const baseMapSelect = document.getElementById('baseMapSelect');
const exportGeoJSONBtn = document.getElementById('exportGeoJSONBtn');
const geojsonFileInput = document.getElementById('geojsonFile');
const toggleEditorBtn = document.getElementById('toggleEditorBtn');
const editorPanel = document.getElementById('editorPanel');
const geojsonEditor = document.getElementById('geojsonEditor');
const applyEditorBtn = document.getElementById('applyEditorBtn');
const layerList = document.getElementById('layerList');
const clearAllBtn = document.getElementById('clearAllBtn');
const showLabelsCheck = document.getElementById('showLabelsCheck');
const markerIconSelect = document.getElementById('markerIconSelect');

// Save slot controls
const saveSlotSelect = document.getElementById('saveSlotSelect');
const saveSlotBtn = document.getElementById('saveSlotBtn');
const loadSlotBtn = document.getElementById('loadSlotBtn');

// Legacy UI elements
const addressFileInput = document.getElementById('addressFile');
const exportBtn = document.getElementById('exportBtn');
const coordFileInput = document.getElementById('coordFile');
const togglePickerBtn = document.getElementById('togglePickerBtn');
const pickedCoordsDiv = document.getElementById('pickedCoords');
const manualNoteInput = document.getElementById('manualNote');
const addManualMarkerBtn = document.getElementById('addManualMarkerBtn');
const searchAddressInput = document.getElementById('searchAddress');
const searchBtn = document.getElementById('searchBtn');
const gotoLatInput = document.getElementById('gotoLat');
const gotoLngInput = document.getElementById('gotoLng');
const gotoCoordBtn = document.getElementById('gotoCoordBtn');
const toggleLayerPanelBtn = document.getElementById('toggleLayerPanelBtn');

// Excel UI elements
const downloadTemplateBtn = document.getElementById('downloadTemplateBtn');
const excelFileInput = document.getElementById('excelFile');
const exportExcelBtn = document.getElementById('exportExcelBtn');

// ==== State Variables ==== //
let pickerMode = false;
let manualMarkerMode = false;
let layerCounter = 0;
let showLabels = false;
let currentMarkerColor = 'blue';
let contextMenuTarget = null;

// ==== Save Slot Management ==== //
function updateSlotOptions() {
    const slots = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5'];
    slots.forEach((slotId, index) => {
        const meta = localStorage.getItem(`geojson_${slotId}_meta`);
        const option = saveSlotSelect.options[index];

        if (meta) {
            try {
                const { timestamp } = JSON.parse(meta);
                const date = new Date(timestamp);
                const dateStr = `${date.getMonth() + 1} -${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} `;
                option.text = `存档 ${index + 1} (${dateStr})`;
            } catch (e) {
                option.text = `存档 ${index + 1} (已保存)`;
            }
        } else {
            option.text = `存档 ${index + 1} (空)`;
        }
    });
}

// Initialize slot options on page load
updateSlotOptions();

// ==== Helper Functions ==== //
function updateLayerList() {
    layerList.innerHTML = '';
    let index = 0;
    drawnItems.eachLayer(layer => {
        const item = document.createElement('div');
        item.className = 'layer-item';
        const type = layer instanceof L.Marker ? '标记' :
            layer instanceof L.Circle ? '圆形' :
                layer instanceof L.Rectangle ? '矩形' :
                    layer instanceof L.Polygon ? '多边形' :
                        layer instanceof L.Polyline ? '折线' : '图层';
        const name = layer.options.name || `${type} ${index + 1} `;
        item.innerHTML = `
        < div class="layer-item-header" >
                <span class="layer-name">${name}</span>
                <span class="layer-type">${type}</span>
            </div >
        <div class="layer-actions">
            <button class="layer-btn" onclick="toggleLayerVisibility(${layer._leaflet_id})">隐藏</button>
            <button class="layer-btn" onclick="renameLayer(${layer._leaflet_id})">重命名</button>
            <button class="layer-btn delete" onclick="deleteLayer(${layer._leaflet_id})">删除</button>
        </div>
    `;
        layerList.appendChild(item);
        index++;
    });
    updateGeoJSONEditor();
}

function updateGeoJSONEditor() {
    const geo = drawnItems.toGeoJSON();
    geojsonEditor.value = JSON.stringify(geo, null, 2);
}

function exportGeoJSON() {
    const data = JSON.stringify(drawnItems.toGeoJSON(), null, 2);
    const uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
    const a = document.createElement('a');
    a.setAttribute('href', uri);
    a.setAttribute('download', 'map.geojson');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importGeoJSON(raw) {
    try {
        const geo = typeof raw === 'string' ? JSON.parse(raw) : raw;
        L.geoJSON(geo, {
            pointToLayer: (feature, latlng) => {
                const icon = getMarkerIcon(feature.properties);
                const marker = L.marker(latlng, { icon });
                marker.feature = { properties: feature.properties || {} };
                bindMarkerContextMenu(marker);
                return marker;
            },
            style: feature => {
                const style = {};
                if (feature.properties) {
                    if (feature.properties.stroke) style.color = feature.properties.stroke;
                    if (feature.properties['stroke-width']) style.weight = feature.properties['stroke-width'];
                    if (feature.properties['stroke-opacity']) style.opacity = feature.properties['stroke-opacity'];
                    if (feature.properties.fill) style.fillColor = feature.properties.fill;
                    if (feature.properties['fill-opacity']) style.fillOpacity = feature.properties['fill-opacity'];
                    if (feature.properties.dashArray || feature.properties.style === 'dashed') style.dashArray = '10,10';
                }
                return style;
            },
            onEachFeature: (feature, layer) => {
                if (feature.properties && feature.properties.name) {
                    layer.options.name = feature.properties.name;
                }
                if (layer instanceof L.Circle && feature.properties) {
                    if (feature.properties.dashArray || feature.properties.style === 'dashed') {
                        layer.setStyle({ dashArray: '10,10', weight: 2 });
                    }
                }
                // Bind popup for point markers
                if (layer instanceof L.Marker) {
                    const latlng = layer.getLatLng();
                    const name = feature.properties?.name || '';
                    const type = feature.properties?.type || '';
                    const address = feature.properties?.address || '';
                    const popupHtml = `<h3>${name}</h3>` +
                        `<p>类型: ${type}<br>地址: ${address}<br>` +
                        `经纬度: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)} ` +
                        `<button onclick="navigator.clipboard.writeText('${latlng.lat},${latlng.lng}')">复制</button></p>`;
                    layer.bindPopup(popupHtml);
                }
                drawnItems.addLayer(layer);
                if (layer instanceof L.Marker) bindMarkerContextMenu(layer);
            }
        });
        updateLayerList();
        if (drawnItems.getLayers().length) map.fitBounds(drawnItems.getBounds());
    } catch (e) {
        alert('GeoJSON 解析错误：' + e.message);
    }
}

function updateLabels() {
    drawnItems.eachLayer(layer => {
        if (layer.getTooltip()) layer.unbindTooltip();
        if (showLabels && layer.options.name) {
            layer.bindTooltip(layer.options.name, { permanent: true, direction: 'center', className: 'layer-label' });
        }
    });
}

// ==== Context Menu Functions ==== //
function bindMarkerContextMenu(marker) {
    marker.on('contextmenu', e => {
        contextMenuTarget = marker;
        const menu = document.getElementById('contextMenu');
        menu.style.left = e.originalEvent.pageX + 'px';
        menu.style.top = e.originalEvent.pageY + 'px';
        menu.style.display = 'block';
    });
}

function hideContextMenu() {
    const menu = document.getElementById('contextMenu');
    menu.style.display = 'none';
    contextMenuTarget = null;
}

function editMarkerProperties() {
    if (!contextMenuTarget) return;
    const newName = prompt('输入新名称：', contextMenuTarget.options.name || '');
    if (newName !== null) {
        contextMenuTarget.options.name = newName;
        if (!contextMenuTarget.feature) contextMenuTarget.feature = { properties: {} };
        contextMenuTarget.feature.properties.name = newName;
        updateLayerList();
        updateLabels();
    }
    hideContextMenu();
}

function changeMarkerIcon() {
    if (!contextMenuTarget) return;
    const color = prompt('输入颜色代码 (例如 #00AA00)：', contextMenuTarget.feature?.properties?.['marker-color'] || '#4a90e2');
    if (color) {
        const icon = createCustomMarkerIcon(color, contextMenuTarget.feature?.properties?.['marker-symbol'] || 'default');
        contextMenuTarget.setIcon(icon);
        if (!contextMenuTarget.feature) contextMenuTarget.feature = { properties: {} };
        contextMenuTarget.feature.properties['marker-color'] = color;
    }
    hideContextMenu();
}

function deleteSelectedMarker() {
    if (!contextMenuTarget) return;
    drawnItems.removeLayer(contextMenuTarget);
    updateLayerList();
    hideContextMenu();
}

map.on('click', () => hideContextMenu());

// ==== Event Listeners ==== //
baseMapSelect.addEventListener('change', () => {
    const sel = baseMapSelect.value;
    Object.values(baseLayers).forEach(l => map.removeLayer(l));
    baseLayers[sel].addTo(map);
});

map.on(L.Draw.Event.CREATED, e => {
    const layer = e.layer;
    layer.options.name = `图层 ${++layerCounter} `;
    if (layer instanceof L.Marker) {
        const icon = createCustomMarkerIcon('#4a90e2', 'default');
        layer.setIcon(icon);
        layer.feature = { properties: { 'marker-color': '#4a90e2' } };
        bindMarkerContextMenu(layer);
    }
    drawnItems.addLayer(layer);
    updateLayerList();
    updateLabels();
});

map.on(L.Draw.Event.EDITED, () => updateLayerList());
map.on(L.Draw.Event.DELETED, () => updateLayerList());

exportGeoJSONBtn.addEventListener('click', exportGeoJSON);
geojsonFileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => importGeoJSON(ev.target.result);
    reader.readAsText(file);
});

toggleEditorBtn.addEventListener('click', () => {
    if (editorPanel.style.display === 'none') {
        editorPanel.style.display = 'flex';
        toggleEditorBtn.textContent = '隐藏代码编辑器';
        updateGeoJSONEditor();
    } else {
        editorPanel.style.display = 'none';
        toggleEditorBtn.textContent = '显示代码编辑器';
    }
});

applyEditorBtn.addEventListener('click', () => {
    drawnItems.clearLayers();
    importGeoJSON(geojsonEditor.value);
});

clearAllBtn.addEventListener('click', () => {
    if (confirm('确定要清空所有图层吗？')) {
        drawnItems.clearLayers();
        updateLayerList();
    }
});

showLabelsCheck.addEventListener('change', e => {
    showLabels = e.target.checked;
    updateLabels();
});

markerIconSelect.addEventListener('change', e => {
    currentMarkerColor = e.target.value;
});

// Save Slot Event Listeners
saveSlotBtn.addEventListener('click', () => {
    const slot = saveSlotSelect.value;
    const content = geojsonEditor.value;
    const meta = {
        timestamp: Date.now(),
        size: content.length
    };
    localStorage.setItem(`geojson_${slot} `, content);
    localStorage.setItem(`geojson_${slot} _meta`, JSON.stringify(meta));
    updateSlotOptions();
    alert('已保存到 ' + saveSlotSelect.options[saveSlotSelect.selectedIndex].text.split(' (')[0]);
});

loadSlotBtn.addEventListener('click', () => {
    const slot = saveSlotSelect.value;
    const content = localStorage.getItem(`geojson_${slot} `);
    if (content) {
        geojsonEditor.value = content;
    } else {
        alert(saveSlotSelect.options[saveSlotSelect.selectedIndex].text.split(' (')[0] + ' 为空');
    }
});

// ---- Legacy Features ---- //
exportBtn.addEventListener('click', () => {
    const rows = [];
    drawnItems.eachLayer(l => {
        if (l instanceof L.Marker) {
            const ll = l.getLatLng();
            rows.push(`${ll.lat},${ll.lng} `);
        }
    });
    const csv = 'data:text/csv;charset=utf-8,latitude,longitude\n' + rows.join('\n');
    const a = document.createElement('a');
    a.setAttribute('href', encodeURI(csv));
    a.setAttribute('download', 'coordinates.csv');
    document.body.appendChild(a);
    a.click();
});

// ==== Excel Functions ==== //

// Download Excel Template
downloadTemplateBtn.addEventListener('click', () => {
    const templateData = [
        {
            '经度 (Longitude)': 120.38,
            '纬度 (Latitude)': 36.07,
            '名称 (Name)': '示例标记',
            '类型 (Type)': 'shop',
            '地址 (Address)': '山东省青岛市市南区',
            '标记颜色 (marker-color)': '#4a90e2',
            '标记符号 (marker-symbol)': 'shop'
        }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '标记数据');
    XLSX.writeFile(wb, '地图标记导入模板.xlsx');
});

// Export to Excel with all fields
exportExcelBtn.addEventListener('click', () => {
    const data = [];
    drawnItems.eachLayer(l => {
        if (l instanceof L.Marker) {
            const ll = l.getLatLng();
            const props = l.feature?.properties || {};
            data.push({
                '经度 (Longitude)': ll.lng,
                '纬度 (Latitude)': ll.lat,
                '名称 (Name)': props.name || '',
                '类型 (Type)': props.type || '',
                '地址 (Address)': props.address || '',
                '标记颜色 (marker-color)': props['marker-color'] || '#4a90e2',
                '标记符号 (marker-symbol)': props['marker-symbol'] || 'default'
            });
        }
    });

    if (data.length === 0) {
        alert('没有标记可导出');
        return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '标记数据');
    XLSX.writeFile(wb, '地图标记数据.xlsx');
});

// Import from Excel
excelFileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
        try {
            const data = new Uint8Array(ev.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet);

            let addedCount = 0;
            rows.forEach(row => {
                // Support multiple column name formats
                const lng = row['经度 (Longitude)'] || row['Longitude'] || row['lng'] || row['经度'];
                const lat = row['纬度 (Latitude)'] || row['Latitude'] || row['lat'] || row['纬度'];

                if (!lng || !lat || isNaN(parseFloat(lng)) || isNaN(parseFloat(lat))) {
                    return;
                }

                const properties = {
                    name: row['名称 (Name)'] || row['Name'] || row['name'] || row['名称'] || '未命名',
                    type: row['类型 (Type)'] || row['Type'] || row['type'] || row['类型'] || '',
                    address: row['地址 (Address)'] || row['Address'] || row['address'] || row['地址'] || '',
                    'marker-color': row['标记颜色 (marker-color)'] || row['marker-color'] || row['color'] || '#4a90e2',
                    'marker-symbol': row['标记符号 (marker-symbol)'] || row['marker-symbol'] || row['symbol'] || 'default'
                };

                const icon = getMarkerIcon(properties);
                const marker = L.marker([parseFloat(lat), parseFloat(lng)], { icon });
                marker.feature = { properties };

                // Bind popup
                const latlng = marker.getLatLng();
                const popupHtml = `<h3>${properties.name}</h3>` +
                    `<p>类型: ${properties.type}<br>地址: ${properties.address}<br>` +
                    `经纬度: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)} ` +
                    `<button onclick="navigator.clipboard.writeText('${latlng.lat},${latlng.lng}')">复制</button></p>`;
                marker.bindPopup(popupHtml);

                bindMarkerContextMenu(marker);
                drawnItems.addLayer(marker);
                addedCount++;
            });

            if (addedCount > 0) {
                updateLayerList();
                map.fitBounds(drawnItems.getBounds());
                alert(`成功导入 ${addedCount} 个标记`);
            } else {
                alert('未找到有效的坐标数据');
            }
        } catch (err) {
            console.error(err);
            alert('Excel 文件解析失败：' + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
});

// Enhanced Coord Import with PapaParse and Type Detection
coordFileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            const rows = results.data;
            let addedCount = 0;

            rows.forEach(row => {
                let lat, lng;

                const latKeys = ['纬度', 'Latitude', 'lat', 'latitude', '纬度 (Latitude)'];
                const lngKeys = ['经度', 'Longitude', 'lng', 'longitude', '经度 (Longitude)'];

                for (const key of latKeys) {
                    if (row[key]) { lat = parseFloat(row[key]); break; }
                }
                for (const key of lngKeys) {
                    if (row[key]) { lng = parseFloat(row[key]); break; }
                }

                if (!isNaN(lat) && !isNaN(lng)) {
                    const name = row['门店'] || row['name'] || row['Name'] || row['名称'] || '未命名';
                    const type = row['类型'] || row['type'] || row['Type'] || '';
                    const address = row['地址'] || row['address'] || row['Address'] || '';

                    const properties = {
                        name: name,
                        type: type,
                        address: address
                    };

                    const icon = getMarkerIcon(properties);
                    const marker = L.marker([lat, lng], { icon: icon });

                    marker.feature = { properties: properties };

                    let popupContent = `< b > ${name}</b > `;
                    if (type) popupContent += `< br > 类型: ${type} `;
                    if (address) popupContent += `< br > 地址: ${address} `;
                    marker.bindPopup(popupContent);

                    bindMarkerContextMenu(marker);
                    drawnItems.addLayer(marker);
                    addedCount++;
                }
            });

            if (addedCount > 0) {
                updateLayerList();
                map.fitBounds(drawnItems.getBounds());
                alert(`成功导入 ${addedCount} 个标记`);
            } else {
                alert('未找到有效的坐标数据，请检查 CSV 文件格式');
            }
        },
        error: function (err) {
            alert('CSV 解析失败: ' + err.message);
        }
    });
});

addressFileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => {
        const rows = Papa.parse(ev.target.result, { header: true }).data;
        for (const row of rows) {
            const address = row.address || row.Address || row.地址;
            if (!address) continue;
            try {
                const resp = await fetch(`${AMAP_GEOCODE_URL}?key=${AMAP_API_KEY}&address=${encodeURIComponent(address)}`);
                const data = await resp.json();
                if (data.geocodes && data.geocodes.length) {
                    const [lng, lat] = data.geocodes[0].location.split(',');
                    const icon = createCustomMarkerIcon('#4a90e2', 'default');
                    const marker = L.marker([parseFloat(lat), parseFloat(lng)], { icon });
                    marker.feature = { properties: { name: address } };
                    bindMarkerContextMenu(marker);
                    drawnItems.addLayer(marker);
                }
            } catch (err) {
                console.error(err);
            }
        }
        updateLayerList();
        if (drawnItems.getLayers().length) map.fitBounds(drawnItems.getBounds());
    };
    reader.readAsText(file);
});

togglePickerBtn.addEventListener('click', () => {
    pickerMode = !pickerMode;
    togglePickerBtn.textContent = pickerMode ? '关闭坐标拾取' : '启用坐标拾取';
    pickedCoordsDiv.textContent = pickerMode ? '点击地图拾取坐标...' : '';
    map.getContainer().style.cursor = pickerMode ? 'crosshair' : '';
});

addManualMarkerBtn.addEventListener('click', () => {
    manualMarkerMode = !manualMarkerMode;
    addManualMarkerBtn.textContent = manualMarkerMode ? '取消添加' : '点击地图添加';
    map.getContainer().style.cursor = manualMarkerMode ? 'crosshair' : '';
});

// Layer panel toggle
toggleLayerPanelBtn.addEventListener('click', () => {
    const panel = document.getElementById('layerPanel');
    if (panel.style.display === 'none' || !panel.style.display) {
        panel.style.display = 'flex';
        toggleLayerPanelBtn.textContent = '隐藏图层面板';
    } else {
        panel.style.display = 'none';
        toggleLayerPanelBtn.textContent = '显示图层面板';
    }
});

searchBtn.addEventListener('click', async () => {
    const addr = searchAddressInput.value.trim();
    if (!addr) { alert('请输入地址'); return; }
    try {
        const resp = await fetch(`${AMAP_GEOCODE_URL}?key=${AMAP_API_KEY}&address=${encodeURIComponent(addr)}`);
        const data = await resp.json();
        if (data.geocodes && data.geocodes.length) {
            const [lng, lat] = data.geocodes[0].location.split(',');
            const latN = parseFloat(lat), lngN = parseFloat(lng);
            map.setView([latN, lngN], 15);
            const icon = createCustomMarkerIcon('#4a90e2', 'default');
            const marker = L.marker([latN, lngN], { icon });
            marker.feature = { properties: { name: addr } };
            bindMarkerContextMenu(marker);
            drawnItems.addLayer(marker);
            updateLayerList();
        } else {
            alert('未找到该地址');
        }
    } catch (e) {
        console.error(e);
        alert('搜索失败');
    }
});

gotoCoordBtn.addEventListener('click', () => {
    const lat = parseFloat(gotoLatInput.value);
    const lng = parseFloat(gotoLngInput.value);
    if (isNaN(lat) || isNaN(lng)) { alert('请输入有效坐标'); return; }
    map.setView([lat, lng], 15);
    const icon = createCustomMarkerIcon('#4a90e2', 'default');
    const marker = L.marker([lat, lng], { icon });
    marker.feature = { properties: { name: `坐标: ${lat.toFixed(6)}, ${lng.toFixed(6)} ` } };
    bindMarkerContextMenu(marker);
    drawnItems.addLayer(marker);
    updateLayerList();
});

map.on('click', e => {
    if (pickerMode) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        pickedCoordsDiv.textContent = `纬度: ${lat}, 经度: ${lng} `;
        if (navigator.clipboard) navigator.clipboard.writeText(`${lat},${lng} `);
        return;
    }
    if (manualMarkerMode) {
        const note = manualNoteInput.value.trim() || '无备注';
        const icon = createCustomMarkerIcon('#4a90e2', 'default');
        const marker = L.marker(e.latlng, { icon });
        marker.feature = { properties: { name: note } };
        bindMarkerContextMenu(marker);
        drawnItems.addLayer(marker);
        manualNoteInput.value = '';
        manualMarkerMode = false;
        addManualMarkerBtn.textContent = '点击地图添加';
        map.getContainer().style.cursor = '';
        updateLayerList();
        return;
    }
});

// ==== Global Functions for Layer Management ==== //
window.toggleLayerVisibility = function (id) {
    drawnItems.eachLayer(l => {
        if (l._leaflet_id === id) {
            if (map.hasLayer(l)) map.removeLayer(l); else map.addLayer(l);
        }
    });
};
window.renameLayer = function (id) {
    drawnItems.eachLayer(l => {
        if (l._leaflet_id === id) {
            const newName = prompt('输入新名称：', l.options.name || '');
            if (newName !== null) {
                l.options.name = newName;
                if (!l.feature) l.feature = { properties: {} };
                l.feature.properties.name = newName;
                updateLayerList();
                updateLabels();
            }
        }
    });
};
window.deleteLayer = function (id) {
    drawnItems.eachLayer(l => {
        if (l._leaflet_id === id) {
            drawnItems.removeLayer(l);
            updateLayerList();
        }
    });
};

// ==== Expose Context Menu Functions ==== //
window.editMarkerProperties = editMarkerProperties;
window.changeMarkerIcon = changeMarkerIcon;
window.deleteSelectedMarker = deleteSelectedMarker;

