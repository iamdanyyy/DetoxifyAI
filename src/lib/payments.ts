interface PaymentRequest {
  amount: number;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  description: string;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  checkout_url?: string;
  payment_id?: string;
}

export class PaymentService {
  private publicKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    this.publicKey = process.env.REACT_APP_INTASEND_PUBLIC_KEY || '';
    this.secretKey = process.env.REACT_APP_INTASEND_SECRET_KEY || '';
    // Use local proxy server to avoid CORS issues
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-domain.com/api' 
      : 'http://localhost:3001/api';
    
    // Log sandbox mode status
    console.log('Payment service initialized in sandbox mode');
    console.log('Using backend proxy at:', this.baseUrl);
  }

  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    // Since we're using backend proxy, we don't need to validate the frontend API key
    console.log('Creating payment via backend proxy...');

    try {
      console.log('Creating payment with data:', paymentData);
      console.log('Using API endpoint:', `${this.baseUrl}/paymentlinks/`);
      console.log('Public key configured:', !!this.publicKey);
      console.log('Public key value:', this.publicKey.substring(0, 20) + '...');
      console.log('Secret key configured:', !!this.secretKey);

      const response = await fetch(`${this.baseUrl}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          currency: paymentData.currency,
          email: paymentData.email,
          first_name: paymentData.first_name,
          last_name: paymentData.last_name,
          phone_number: paymentData.phone_number,
          description: paymentData.description,
        }),
      });

      console.log('Payment response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Payment API error:', errorData);
        
        // Try to parse JSON error response
        try {
          const errorJson = JSON.parse(errorData);
          throw new Error(`Payment request failed: ${errorJson.message || errorJson.detail || 'Unknown error'}`);
        } catch {
          // If not JSON, use the raw text
          throw new Error(`Payment request failed: ${response.status} - ${errorData.substring(0, 100)}`);
        }
      }

      const data = await response.json();
      console.log('Payment created successfully:', data);
      
      return {
        success: true,
        message: 'Payment link created successfully',
        checkout_url: data.checkout_url,
        payment_id: data.payment_id,
      };
    } catch (error) {
      console.error('Payment error:', error);
      return {
        success: false,
        message: `Failed to create payment: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/verify/${paymentId}`);

      if (!response.ok) return false;

      const data = await response.json();
      console.log('Payment verification result:', data);
      return data.isCompleted;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }
}

export const paymentService = new PaymentService();

