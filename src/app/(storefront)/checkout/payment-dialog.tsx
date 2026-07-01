'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/lib/utils';
import { createAndPayAction } from '@/actions/order-actions';
import { STORE_PAYMENT_ACCOUNT } from '@/constants/store';
import type { CreateOrderInput } from '@/schemas/order-schema';
const stripePublishableKey =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY : '';
type PaymentMethod = 'stripe' | 'easypaisa' | 'jazzcash' | 'half' | 'cod';
interface PendingOrder {
  checkoutData: CreateOrderInput;
  totalAmount: number;
  paymentMethod: PaymentMethod;
}
interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingOrder: PendingOrder;
  onSuccess: (orderId: string) => void;
}
export function PaymentDialog({ open, onOpenChange, pendingOrder, onSuccess }: PaymentDialogProps) {
  const { checkoutData, totalAmount, paymentMethod } = pendingOrder;
  const method = paymentMethod as 'stripe' | 'easypaisa' | 'jazzcash' | 'half';
  if (method === 'stripe') {
    return (
      <StripePaymentDialog
        open={open}
        onOpenChange={onOpenChange}
        checkoutData={checkoutData}
        totalAmount={totalAmount}
        onSuccess={onSuccess}
      />
    );
  }
  if (method === 'half') {
    return (
      <HalfPaymentDialog
        open={open}
        onOpenChange={onOpenChange}
        checkoutData={checkoutData}
        totalAmount={totalAmount}
        onSuccess={onSuccess}
      />
    );
  }
  return (
    <MobilePaymentDialog
      open={open}
      onOpenChange={onOpenChange}
      checkoutData={checkoutData}
      totalAmount={totalAmount}
      paymentMethod={method}
      onSuccess={onSuccess}
    />
  );
}
function MobilePaymentDialog({
  open,
  onOpenChange,
  checkoutData,
  totalAmount,
  paymentMethod,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkoutData: CreateOrderInput;
  totalAmount: number;
  paymentMethod: 'easypaisa' | 'jazzcash';
  onSuccess: (orderId: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const methodLabel = paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash';
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }
    setScreenshotPreview(URL.createObjectURL(file));
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload/imgbb', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.image_url) {
        toast.error(data.error || 'Upload failed');
        setScreenshotPreview('');
        return;
      }
      setScreenshotUrl(data.image_url);
      toast.success('Payment screenshot uploaded');
    } catch {
      toast.error('Upload failed. Please try again.');
      setScreenshotPreview('');
    } finally {
      setUploading(false);
    }
  }
  async function handleSubmit() {
    if (!accountNumber.trim()) {
      toast.error('Account number is required');
      return;
    }
    if (!transactionId.trim()) {
      toast.error('Transaction ID is required');
      return;
    }
    if (!screenshotUrl) {
      toast.error('Please upload a payment screenshot as proof of payment');
      return;
    }
    setIsProcessing(true);
    const result = await createAndPayAction(checkoutData, {
      accountNumber: accountNumber.trim(),
      transactionId: transactionId.trim(),
      paymentScreenshot: screenshotUrl,
    });
    setIsProcessing(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Payment confirmed');
    onSuccess(result.data!.id);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {' '}
      <DialogContent className="sm:max-w-md">
        {' '}
        <DialogHeader>
          {' '}
          <DialogTitle>Complete Payment</DialogTitle>{' '}
        </DialogHeader>{' '}
        <div className="max-h-[75vh] space-y-6 overflow-y-auto pr-1">
          {' '}
          <div className="text-center">
            {' '}
            <p className="text-2xl font-bold">{formatPrice(totalAmount)}</p>{' '}
            <p className="text-muted-foreground text-sm">Total</p>{' '}
          </div>{' '}
          <div className="bg-border h-px w-full" />{' '}
          <div className="border-foreground/20 from-muted to-background rounded-xl border-2 bg-gradient-to-br p-5 shadow-lg shadow-black/5 cursor-pointer transition-shadow duration-300 hover:shadow-xl">
            {' '}
            <div className="flex items-center gap-2">
              {' '}
              <div className="bg-foreground text-background flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                {' '}
                ${' '}
              </div>{' '}
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {' '}
                Send Payment To{' '}
              </p>{' '}
            </div>{' '}
            <div className="mt-3 space-y-1">
              {' '}
              <p className="text-foreground text-xl font-bold tracking-wider">
                {STORE_PAYMENT_ACCOUNT.number}
              </p>{' '}
              <p className="text-foreground text-sm font-medium">{STORE_PAYMENT_ACCOUNT.holder}</p>{' '}
              <p className="text-muted-foreground text-xs">{STORE_PAYMENT_ACCOUNT.service}</p>{' '}
            </div>{' '}
          </div>{' '}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            {' '}
            <strong>Note:</strong> After sending payment to the account above, enter your{' '}
            {methodLabel} details below and upload the transaction screenshot. Orders without
            payment confirmation will not be processed.{' '}
          </div>{' '}
          <div className="space-y-4">
            {' '}
            <div className="space-y-2">
              {' '}
              <Label htmlFor="accountNumber">Your {methodLabel} Account Number</Label>{' '}
              <Input
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 0300 1234567"
                className="border-border bg-background/50"
              />{' '}
            </div>{' '}
            <div className="space-y-2">
              {' '}
              <Label htmlFor="transactionId">Transaction ID</Label>{' '}
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Transaction ID"
                className="border-border bg-background/50"
              />{' '}
            </div>{' '}
            <div className="space-y-2">
              {' '}
              <Label>
                Payment Screenshot <span className="text-destructive">*</span>
              </Label>{' '}
              <p className="text-muted-foreground text-xs">
                {' '}
                Upload a screenshot of your {methodLabel} transaction confirmation.{' '}
              </p>{' '}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="text-muted-foreground file:bg-foreground file:text-background block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:cursor-pointer"
              />{' '}
              {uploading && <p className="text-muted-foreground text-xs">Uploading...</p>}{' '}
              {screenshotPreview && (
                <div className="border-border mt-2 overflow-hidden rounded-md border">
                  {' '}
                  {/* eslint-disable-next-line @next/next/no-img-element */}{' '}
                  <img
                    src={screenshotPreview}
                    alt="Payment screenshot preview"
                    className="h-32 w-full object-cover"
                  />{' '}
                </div>
              )}{' '}
            </div>{' '}
          </div>{' '}
          <Button
            onClick={handleSubmit}
            disabled={isProcessing || uploading}
            className="w-full rounded-full"
          >
            {' '}
            {isProcessing ? 'Processing...' : `Pay ${formatPrice(totalAmount)}`}{' '}
          </Button>{' '}
        </div>{' '}
      </DialogContent>{' '}
    </Dialog>
  );
}
function StripePaymentDialog({
  open,
  onOpenChange,
  checkoutData,
  totalAmount,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkoutData: CreateOrderInput;
  totalAmount: number;
  onSuccess: (orderId: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const hasStripeKey = Boolean(stripePublishableKey);
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }
    setScreenshotPreview(URL.createObjectURL(file));
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload/imgbb', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.image_url) {
        toast.error(data.error || 'Upload failed');
        setScreenshotPreview('');
        return;
      }
      setScreenshotUrl(data.image_url);
      toast.success('Payment screenshot uploaded');
    } catch {
      toast.error('Upload failed. Please try again.');
      setScreenshotPreview('');
    } finally {
      setUploading(false);
    }
  }
  async function handleSubmit() {
    if (!screenshotUrl) {
      toast.error('Please upload a payment screenshot as proof of payment');
      return;
    }
    setIsProcessing(true);
    const result = await createAndPayAction(checkoutData, {
      paymentIntentId: `sim_pi_${Date.now()}`,
      cardLastFour: '4242',
      paymentScreenshot: screenshotUrl,
    });
    setIsProcessing(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Payment successful');
    onSuccess(result.data!.id);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {' '}
      <DialogContent className="sm:max-w-md">
        {' '}
        <DialogHeader>
          {' '}
          <DialogTitle>Complete Payment</DialogTitle>{' '}
        </DialogHeader>{' '}
        <div className="max-h-[75vh] space-y-6 overflow-y-auto pr-1">
          {' '}
          <div className="text-center">
            {' '}
            <p className="text-2xl font-bold">{formatPrice(totalAmount)}</p>{' '}
            <p className="text-muted-foreground text-sm">Total</p>{' '}
          </div>{' '}
          <div className="bg-border h-px w-full" />{' '}
          {hasStripeKey ? (
            <div className="border-border bg-background/50 rounded-md border p-4">
              {' '}
              <p className="text-muted-foreground text-sm">
                {' '}
                Stripe Card Element would render here.{' '}
              </p>{' '}
            </div>
          ) : (
            <div className="border-border bg-muted/50 rounded-md border p-4">
              {' '}
              <p className="text-sm font-medium text-amber-700">
                {' '}
                Stripe is not configured. Payment will be simulated.{' '}
              </p>{' '}
              <p className="text-muted-foreground mt-2 text-xs"> Card: **** **** **** 4242 </p>{' '}
            </div>
          )}{' '}
          <div className="space-y-2">
            {' '}
            <Label>
              Payment Screenshot <span className="text-destructive">*</span>
            </Label>{' '}
            <p className="text-muted-foreground text-xs">
              {' '}
              Upload a screenshot of your payment confirmation as proof.{' '}
            </p>{' '}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="text-muted-foreground file:bg-foreground file:text-background block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:cursor-pointer"
            />{' '}
            {uploading && <p className="text-muted-foreground text-xs">Uploading...</p>}{' '}
            {screenshotPreview && (
              <div className="border-border mt-2 overflow-hidden rounded-md border">
                {' '}
                {/* eslint-disable-next-line @next/next/no-img-element */}{' '}
                <img
                  src={screenshotPreview}
                  alt="Payment screenshot preview"
                  className="h-32 w-full object-cover"
                />{' '}
              </div>
            )}{' '}
          </div>{' '}
          <Button
            onClick={handleSubmit}
            disabled={isProcessing || uploading}
            className="w-full rounded-full"
          >
            {' '}
            {isProcessing ? 'Processing...' : `Pay ${formatPrice(totalAmount)}`}{' '}
          </Button>{' '}
          {!hasStripeKey && (
            <p className="text-muted-foreground text-center text-xs"> Secured by Stripe </p>
          )}{' '}
        </div>{' '}
      </DialogContent>{' '}
    </Dialog>
  );
}
function HalfPaymentDialog({
  open,
  onOpenChange,
  checkoutData,
  totalAmount,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkoutData: CreateOrderInput;
  totalAmount: number;
  onSuccess: (orderId: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const halfAmount = totalAmount / 2;
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }
    setScreenshotPreview(URL.createObjectURL(file));
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload/imgbb', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.image_url) {
        toast.error(data.error || 'Upload failed');
        setScreenshotPreview('');
        return;
      }
      setScreenshotUrl(data.image_url);
      toast.success('Screenshot uploaded');
    } catch {
      toast.error('Upload failed. Please try again.');
      setScreenshotPreview('');
    } finally {
      setUploading(false);
    }
  }
  async function handleSubmit() {
    if (!accountNumber.trim()) {
      toast.error('Account number is required');
      return;
    }
    if (!transactionId.trim()) {
      toast.error('Transaction ID is required');
      return;
    }
    if (!screenshotUrl) {
      toast.error('Please upload a payment screenshot');
      return;
    }
    setIsProcessing(true);
    const result = await createAndPayAction(checkoutData, {
      accountNumber: accountNumber.trim(),
      transactionId: transactionId.trim(),
      paymentScreenshot: screenshotUrl,
      paidAmount: halfAmount,
    });
    setIsProcessing(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Half payment confirmed. Remaining 50% will be collected on delivery.');
    onSuccess(result.data!.id);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {' '}
      <DialogContent className="sm:max-w-md">
        {' '}
        <DialogHeader>
          {' '}
          <DialogTitle>Complete Payment (50% Now)</DialogTitle>{' '}
        </DialogHeader>{' '}
        <div className="max-h-[75vh] space-y-6 overflow-y-auto pr-1">
          {' '}
          <div className="border-foreground/20 from-muted to-background rounded-xl border-2 bg-gradient-to-br p-5 shadow-lg shadow-black/5 cursor-pointer transition-shadow duration-300 hover:shadow-xl">
            {' '}
            <div className="flex items-center gap-2">
              {' '}
              <div className="bg-foreground text-background flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                {' '}
                ${' '}
              </div>{' '}
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {' '}
                Send 50% Payment To{' '}
              </p>{' '}
            </div>{' '}
            <div className="mt-3 space-y-1">
              {' '}
              <p className="text-foreground text-xl font-bold tracking-wider">
                {STORE_PAYMENT_ACCOUNT.number}
              </p>{' '}
              <p className="text-foreground text-sm font-medium">{STORE_PAYMENT_ACCOUNT.holder}</p>{' '}
              <p className="text-muted-foreground text-xs">{STORE_PAYMENT_ACCOUNT.service}</p>{' '}
            </div>{' '}
          </div>{' '}
          <div className="space-y-2">
            {' '}
            <div className="flex justify-between text-sm">
              {' '}
              <span className="text-muted-foreground">Total</span>{' '}
              <span>{formatPrice(totalAmount)}</span>{' '}
            </div>{' '}
            <div className="flex justify-between text-sm font-semibold">
              {' '}
              <span>Pay now (50%)</span>{' '}
              <span className="text-foreground">{formatPrice(halfAmount)}</span>{' '}
            </div>{' '}
            <div className="text-muted-foreground flex justify-between text-sm">
              {' '}
              <span>On delivery (50%)</span> <span>{formatPrice(halfAmount)}</span>{' '}
            </div>{' '}
          </div>{' '}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            {' '}
            <strong>Note:</strong> Send 50% to the account above, then enter your details and upload
            the transaction screenshot. The remaining 50% will be collected on delivery. Orders
            without payment confirmation will not be processed.{' '}
          </div>{' '}
          <div className="bg-border h-px w-full" />{' '}
          <div className="space-y-4">
            {' '}
            <div className="space-y-2">
              {' '}
              <Label htmlFor="halfAccountNumber">Your Account Number</Label>{' '}
              <Input
                id="halfAccountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 0300 1234567"
                className="border-border bg-background/50"
              />{' '}
            </div>{' '}
            <div className="space-y-2">
              {' '}
              <Label htmlFor="halfTransactionId">Transaction ID</Label>{' '}
              <Input
                id="halfTransactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Transaction ID"
                className="border-border bg-background/50"
              />{' '}
            </div>{' '}
            <div className="space-y-2">
              {' '}
              <Label>
                Payment Screenshot <span className="text-destructive">*</span>
              </Label>{' '}
              <p className="text-muted-foreground text-xs">
                {' '}
                Upload a screenshot of your transaction confirmation.{' '}
              </p>{' '}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="text-muted-foreground file:bg-foreground file:text-background block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:cursor-pointer"
              />{' '}
              {uploading && <p className="text-muted-foreground text-xs">Uploading...</p>}{' '}
              {screenshotPreview && (
                <div className="border-border mt-2 overflow-hidden rounded-md border">
                  {' '}
                  {/* eslint-disable-next-line @next/next/no-img-element */}{' '}
                  <img
                    src={screenshotPreview}
                    alt="Payment screenshot preview"
                    className="h-32 w-full object-cover"
                  />{' '}
                </div>
              )}{' '}
            </div>{' '}
          </div>{' '}
          <Button
            onClick={handleSubmit}
            disabled={isProcessing || uploading}
            className="w-full rounded-full"
          >
            {' '}
            {isProcessing ? 'Processing...' : `Pay ${formatPrice(halfAmount)} Now`}{' '}
          </Button>{' '}
        </div>{' '}
      </DialogContent>{' '}
    </Dialog>
  );
}
