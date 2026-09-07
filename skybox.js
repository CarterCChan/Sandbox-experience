class Skybox { //https://webglfundamentals.org/webgl/lessons/webgl-skybox.html
    constructor(gl, images) {
        // Skybox vertices - define a cube (1x1x1)
        this.vertices = [
            -100.0,  100.0, -100.0,  // Front top left
            -100.0, -100.0, -100.0,  // Front bottom left
            100.0, -100.0, -100.0,   // Front bottom right
            100.0,  100.0, -100.0,   // Front top right
        
            -100.0,  100.0,  100.0,  // Back top left
            -100.0, -100.0,  100.0,  // Back bottom left
            100.0, -100.0,  100.0,   // Back bottom right
            100.0,  100.0,  100.0    // Back top right
        ];

        // Skybox indices for the cube 
        this.indices = [
            0, 1, 2, 0, 2, 3,  // Front face
            4, 5, 6, 4, 6, 7,  // Back face
            4, 5, 1, 4, 1, 0,  // Left face
            3, 2, 6, 3, 6, 7,  // Right face
            4, 0, 3, 4, 3, 7,  // Top face
            1, 5, 6, 1, 6, 2   // Bottom face
        ];

        // Initialize buffers
        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        // Load the cubemap texture
        this.texture = this.loadSkyboxTexture(gl, images);
    }

    loadSkyboxTexture(gl, images) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

        const faceInfos = [
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: images.right },
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: images.left },
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: images.top },
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: images.bottom },
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: images.front },
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: images.back }
        ];

        const promises = faceInfos.map(faceInfo => {
            return new Promise((resolve) => {
                const image = new Image();
                image.onload = function () {
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                    gl.texImage2D(faceInfo.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                    resolve();
                };
                image.src = faceInfo.url;
            });
        });

        Promise.all(promises).then(() => {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        });
    
        // Set texture parameters
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

        return texture;
    }

    render(gl, skyboxProgram, projection, view) {
        // Use skybox shader program
        gl.useProgram(skyboxProgram);

        // Disable depth writing so the skybox is always rendered behind other objects
        gl.depthMask(false);

        // Update uniforms
        set_uniform_matrix4(gl, skyboxProgram, 'projection', projection.data);

        // Remove translation from view matrix (only rotate the skybox)
        const viewNoTranslation = view.clone().setTranslation(0, 0, 0);
        set_uniform_matrix4(gl, skyboxProgram, 'view', viewNoTranslation.data);

        // Bind the cubemap texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

        // Bind buffers and draw the skybox cube
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        const positionLocation = gl.getAttribLocation(skyboxProgram, 'coordinates');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

        // Enable depth writing for the rest of the scene
        gl.depthMask(true);
    }
}
