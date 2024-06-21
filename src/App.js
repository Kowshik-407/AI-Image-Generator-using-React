import { useState } from "react"
import Modal from "./components/Modal"

const App = () => {
  const [images, setImages] = useState(null)
  const [value, setValue] = useState(null)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const surpriseOptions = [
    'A blue ostrich eating melon',
    'A matisse style shark on the telephone',
    'A pineapple sunbathing on an island',
    'Ukiyo-e print of two men visiting a shrine.',
    'Cyberpunk style city street at night, Expressionism.',
    'Action painting of a cottage near a pond, spring time.',
    'an armchair in the shape of an avocado',
    'Cityscape at sunset in retro vector illustration ',
    'Memphis style painting of a flower vase on a kitchen table with a window in the backdrop.',
    'a teddy bear on a skateboard',
    'Illustration of a cat sitting on a couch in a living room with a coffee mug in its hand.',
    'a home built in a huge Soap bubble, windows, doors, porches, awnings, middle of SPACE, cyberpunk lights, Hyper Detail, 8K, HD, Octane Rendering, Unreal Engine, V-Ray, full hd -- s5000 --uplight --q 3 --stop 80--w 0.5 --ar 1:3',
    'photo of an extremely cute alien fish swimming an alien habitable underwater planet, coral reefs, dream-like atmosphere, water, plants, peaceful, serenity, calm ocean, tansparent water, reefs, fish, coral, inner peace, awareness, silence, nature, evolution --version 3 --s 42000 --uplight --ar 4:3 --no text, blur',
    'hyerophant, god light, cinematic look, octane render, under water, --wallpaper',
    'modern kids play area landscape architecture, water play area, floating kids, seating areas, perspective view, rainy weather, biopunk, cinematic photo, highly detailed, cinematic lighting, ultra-detailed, ultrarealistic, photorealism, 8k, octane render, --ar 16:12',
    'photorealistic flying house, many details, Ultra detailed, octane render, by Alexander Jansson --ar 2:1',
    'fibonacci, stone, snail, wallpaper, colorful, blue gray green, 3d pattern, 8k',
    'pale young man sitting in an armchair reading beside a big fireplace, bookshelves covering the dark walls, dogs lying on the floor, rule of thirds, dark room, --ar 21:9',
    'in darkest blue subway,a side road of huge underground sewage channel --s 8000 --hd --wallpaper',
    'synthwave galaxy being eaten by Galactus, HDR, cinematic, ultrawide, realistic, highly detailed --aspect 16:9 --quality 2 --stylize 650'
  ]

  const getImages = async () => {
    console.log(value)
    setImages(null)
    if(value === null){
      setError("Error! Must have a search term")
      return
    }
    try{
      if(value === null || value === undefined || value === ""){
        setError("Error! Must have a search term")
      }
      else{
        const response = await fetch('http://localhost:8000/images', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: value
          })
        })
        const data = await response.json()
        console.log(data)
        setImages(data)
      }
    } catch(error){
      console.error(error)
    }
  }

  const surpriseMe = () => {
    setImages(null)
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randomValue)
  }

  const uploadImage = async (e) => {
    console.log(e.target.files[0])

    // We created a form in case you want to append more info to the formData 
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setSelectedImage(e.target.files[0])
    setModalOpen(true)
    e.target.value = null
    try{
      const response = await fetch('http://localhost:8000/upload', {
        method: "POST",
        body: formData
      })
      const data = await response.json()
      console.log(data)
    } catch(error){
      console.error(error)
    }
  }

  const generateVariations = async () => {
    setImages(null)
    if(selectedImage === null){
      setError("Error! Must have an existing image")
      setModalOpen(false)
      return
    }
    try{
      const response = await fetch('http://localhost:8000/variations', {
        method: "POST"
      })
      const data = await response.json()
      console.log(data)
      setImages(data)
      setError(null)
      setModalOpen(false)
    } catch(error){
      console.error(error)
    }
  }

  console.log(error)

  return (
    <div className="app">
      {/* Input Prompt Section - For Generations */}
      <section className="search-section">
        <p>Start with a detailed description 
          <span className="surprise" onClick={surpriseMe}>Surprise Me</span>
        </p>
        <div className="input-container">
          <input 
            placeholder="An impressionist oil painting of a sunflower in a purple vase..."
            onChange={e => setValue(e.target.value)}
            value={value}
          />
          <button onClick={getImages}>Generate</button>
        </div>
        <p className="extra-info">Or, 
          <span>
            <label htmlFor="files" className="input-image"><u>Upload an image</u> </label>
            <input onChange={uploadImage} id="files" accept="image/*" type="file" hidden/>
          </span>
          to edit. <span className="image-info" title="Image resolution should be 256 x 256 pixels">&#x1F6C8;</span>
        </p>
        {error && <p className="error-info">{error}</p>}
        {modalOpen && <div className="overlay">
          <Modal setModalOpen={setModalOpen} setSelectedImage={setSelectedImage} selectedImage={selectedImage} generateVariations={generateVariations} />
        </div>}
      </section>

      {/* Upload Section - For variations */}
      <section className="image-section">
        {images?.map((image, _index) => (
          <img key={_index} src={image.url} alt={`Generated image of ${value}`}/>
        ))}
      </section>
    </div>
  )
}

export default App
