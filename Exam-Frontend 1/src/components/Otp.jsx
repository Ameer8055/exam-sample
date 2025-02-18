import React, { useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

const Otp = () => {
  const location = useLocation()
  const email = location.state?.email || ''
  const navigate = useNavigate();


  const [otp, setOtp] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {

      const response = await axios.post('http://localhost:3000/Email/verify-otp', {
        email,
        otp
      })
      console.log('OTP verification response:', response.data)
      navigate('/home');
    } catch (error) {
      alert('Please enter correct OTP');
    }
  }


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">OTP Verification</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label">OTP Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength="6"
                    pattern="\d{6}"
                    title="Please enter a 6-digit OTP"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Verify OTP
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Otp
