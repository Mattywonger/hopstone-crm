import React, { FormEvent, useState } from 'react';
import Header from './header';
import { Firebase } from '../providers/user';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { ErrorDisplay } from './Error';
import { ref, uploadBytes } from 'firebase/storage';
import { Navigate, useNavigate } from 'react-router-dom';
import { LoadingPage } from './LoadingPage';
import { useCollection } from 'react-firebase-hooks/firestore';


const labelStyle: React.CSSProperties = {
  color: 'grey',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
};


const inputStyle = {
  padding: '15px',
  marginTop: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
  width: '100%',

};

const buttonStyle = {
  padding: '15px 30px',
  border: 'none',
  borderRadius: '4px',
  background: '#007bff',
  color: 'white',
  cursor: 'pointer',
  marginTop: '8px',
  width: '100%',

};

const AddNewDeal = () => {
  const { firestore, storage } = Firebase.useContainer()

  const [pods, loading, podError] = useCollection(collection(firestore, 'pods'))

  const [error, setError] = useState<Error>()

  const [writing, setWriting] = useState<boolean>(false)

  const [dealName, setName] = useState<string>("")
  const [companyName, setCompanyName] = useState<string>("")
  const [pointPerson, setPointPerson] = useState<string>("")
  const [pointPersonEmail, setPointPersonEmail] = useState<string>("")
  const [pointPersonLinkedin, setPointPersonLinkedin] = useState<string>("")

  const [pointPersonPhoto, setPointPersonPhoto] = useState<File>()
  const [arp, setARP] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [industry, setIndustry] = useState<string>("")
  const [round, setRound] = useState<string>("")
  const [pod, setPod] = useState<string>("")

  const [pitchDeck, setPitchDeck] = useState<File>()
  const [pitchRecording, setPitchRecording] = useState<File>()
  const [additionalFiles, setAdditionalFiles] = useState<FileList>()

  const navigate = useNavigate()

  const createDeal = (event: FormEvent) => {
    event.preventDefault()

    if (pitchDeck == undefined) {
      setError(Error("No Pitch Deck!"))
      return;
    } else if (pitchRecording == undefined) {
      setError(Error("No Recording!"))
      return;
    } else if (pointPersonPhoto == undefined) {
      setError(Error("No Point Person Photo"))
      return;
    }

    setWriting(true)

    addDoc(collection(firestore, "Deals"), {
      dealName,
      companyName,
      pointPerson,
      pointPersonEmail,
      Linkedin: pointPersonLinkedin,
      arp,
      status,
      industry,
      round,
      pod
    }).catch(setError).then(
      document => {
        console.log(document)
        if (!document) {
          throw Error("Empty Document")
        }
        let deckPath = ref(storage, `Deals/${document.id}/deck`)
        let recordingPath = ref(storage, `Deals/${document.id}/recording`)
        let photoPath = ref(storage, `Deals/${document.id}/pointPersonPhoto`)

        const additionalFilePromises = additionalFiles == undefined ? [] :
          Array.from(additionalFiles)
            .map(file => uploadBytes(ref(storage, `Deals/${document.id}/additionalFiles/${file.name}`), file))

        Promise.all([
          uploadBytes(deckPath, pitchDeck),
          uploadBytes(recordingPath, pitchRecording),
          uploadBytes(photoPath, pointPersonPhoto),
          ...additionalFilePromises
        ]).catch(setError).then(_ => navigate("/"))
      }
    ).finally(() => setWriting(false))
    //TODO is the ordering of promises reasonable here?
  }


  return (
    <>
      <Header />

      {error && <ErrorDisplay error={error} />}

      {writing || loading ? <LoadingPage /> :
        <div style={{ background: '#f0f0f0', padding: '40px', boxSizing: 'border-box', paddingTop: '100px' }}> {/* Adjusted padding to accommodate fixed header */}
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            background: 'white',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#333', margin: '0 0 30px', fontWeight: 'bold', fontSize: '30px' }}>Deals: Add New</h2>
            <form className="add-deal-form" style={{ display: 'grid', gap: '24px' }}>
              <label style={labelStyle}>
                Deal Name
                <input type="text" name="dealName" style={inputStyle} onChange={event => setName(event.target.value)} />
              </label>
              <label style={labelStyle}>
                Company Name
                <input type="text" name="companyName" style={inputStyle} onChange={event => setCompanyName(event.target.value)} />
              </label>
              <label style={labelStyle}>
                Point Person Name
                <input type="text" name="pointPersonName" style={inputStyle} onChange={event => setPointPerson(event.target.value)} />
              </label>
              <label style={labelStyle}>
                Point Person Email
                <input type="email" name="pointPersonEmail" style={inputStyle} onChange={event => setPointPersonEmail(event.target.value)} />
              </label>
              <label style={labelStyle}>
                Point Person Linkedin
                <input type="text" name="pointPersonLinkedin" style={inputStyle} onChange={event => setPointPersonLinkedin(event.target.value)} />
              </label>
              <label style={labelStyle}>
                Point Person Photo
                <input type="file" name="pointPersonPhoto" style={inputStyle} onChange={event => setPointPersonPhoto(event.target.files ? event.target.files[0] : undefined)} />
              </label><label style={labelStyle}>
                Active, Rejected, Post Investment
                <select name="dealType" style={inputStyle} onChange={event => setARP(event.target.value)}>
                  <option value="">Select...</option>
                  <option value="active">Active</option>
                  <option value="rejected">Rejected</option>
                  <option value="postInvestment">Post Investment</option>
                </select>
              </label>
              <label style={labelStyle}>
                Deal Status
                <select name="dealStatus" style={inputStyle} onChange={event => setStatus(event.target.value)}>
                  <option value="">Select...</option>
                  <option value="">One-pager</option>
                  <option value="active">Due-Dilligence</option>
                  <option value="rejected">Investment Memo</option>
                  <option value="postInvestment">LP Pitching</option>
                </select>
              </label>
              <label style={labelStyle}>
                Industry
                <select name="industry" style={inputStyle} onChange={event => setIndustry(event.target.value)}>
                  <option value="">Select...</option>
                  <option value="">Real Estate</option>
                  <option value="active">Fintech</option>
                  <option value="rejected">Hardware</option>
                  <option value="postInvestment">AI</option>
                  <option value="">VR</option>
                  <option value="">Ecommerce</option>
                  <option value="active">B2B</option>
                  <option value="rejected">Delivery Service</option>
                  <option value="postInvestment">B2C</option>
                  <option value="">MedTech</option>
                  <option value="">HCIT</option>
                  <option value="active">SaaS</option>
                  <option value="rejected">BioTech</option>
                  <option value="postInvestment">EdTech</option>
                </select>
              </label>
              <label style={labelStyle}>
                Round of Funding
                <select name="roundOfFunding" style={inputStyle} onChange={event => setRound(event.target.value)}>
                  <option value="">Select...</option>
                  <option value="">Pre-Seed</option>
                  <option value="">Seed Round</option>
                  <option value="active">Series A</option>
                  <option value="rejected">Series B</option>
                  <option value="postInvestment">Series C</option>
                </select>
              </label>
              <label style={labelStyle}>
                Pod
                <select name="pod" style={inputStyle} onChange={event => setPod(event.target.value)}>
                  {
                    pods?.docs.map(pod =>
                      <option>
                        {pod.id}
                      </option>
                    )
                  }
                </select>
              </label>


              <label style={labelStyle}>
                Pitch Deck
                <input type="file" name="pitchDeck" style={inputStyle} onChange={event => event.target.files && setPitchDeck(event.target.files[0])} />
              </label>
              <label style={labelStyle}>
                Pitch Recording
                <input type="file" name="pitchRecording" style={inputStyle} onChange={event => event.target.files && setPitchRecording(event.target.files[0])} />
              </label>
              <label style={labelStyle}>
                Additional Files
                <input type="file" name="additionalFiles" style={inputStyle} multiple onChange={event => event.target.files && setAdditionalFiles(event.target.files)} />
              </label>

              <button type="submit" style={buttonStyle} onClick={createDeal}>Save</button>
            </form>
          </div>
        </div>}
    </>
  );
}

export default AddNewDeal;