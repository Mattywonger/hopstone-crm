import React from 'react';
import Header from './header';

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
  
    return (
      <>
      <Header />
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
              <input type="text" name="dealName" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Company Name
              <input type="text" name="companyName" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Point Person Name
              <input type="text" name="pointPersonName" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Point Person Email
              <input type="email" name="pointPersonEmail" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Point Person Linkedin
              <input type="text" name="pointPersonLinkedin" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Point Person Photo
              <input type="file" name="pointPersonPhoto" style={inputStyle} />
            </label><label style={labelStyle}>
              Active, Rejected, Post Investment
              <select name="dealType" style={inputStyle}>
                <option value="">Select...</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
                <option value="postInvestment">Post Investment</option>
              </select>
            </label>
            <label style={labelStyle}>
              Deal Status
              <select name="dealStatus" style={inputStyle}>
                <option value="">Select...</option>
                <option value="">One-pager</option>
                <option value="active">Due-Dilligence</option>
                <option value="rejected">Investment Memo</option>
                <option value="postInvestment">LP Pitching</option>
              </select>
            </label>
            <label style={labelStyle}>
              Industry
              <select name="industry" style={inputStyle}>
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
              <select name="roundOfFunding" style={inputStyle}>
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
              <select name="pod" style={inputStyle}>
                <option value="">Select...</option>
                <option value="">Aaron's Pod</option>
                <option value="active">Aneesha's Pod</option>
                <option value="rejected">HopStone Capital</option>
                <option value="postInvestment">Joseph's Pod</option>
                <option value="postInvestment">Pano's Pod</option>
                <option value="postInvestment">Rachel's Pod</option>
              </select>
            </label>

            
            <label style={labelStyle}>
              Pitch Deck
              <input type="file" name="pitchDeck" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Pitch Recording
              <input type="file" name="pitchRecording" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Additional Files
              <input type="file" name="additionalFiles" style={inputStyle} multiple />
            </label>

            <button type="submit" style={buttonStyle}>Save</button>
          </form>
          </div>
      </div>
    </>
  );
}

export default AddNewDeal;