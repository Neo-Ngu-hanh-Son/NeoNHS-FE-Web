import { useState, useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { VendorProfile } from '@/types';
import VendorService from '@/services/api/vendorService';
import { MapPicker } from '@/components/common/MapPicker';
import { ProfileAvatar } from './ProfileAvatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  MapPin,
  Landmark,
  Lightbulb,
  Save,
  RotateCcw,
} from 'lucide-react';

const { TextArea } = Input;

interface VendorEditFormProps {
  vendor: VendorProfile;
  onSaved?: (vendor: VendorProfile) => void;
}

export function VendorEditForm({ vendor, onSaved }: VendorEditFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>(
    vendor.latitude && vendor.longitude
      ? { lat: parseFloat(vendor.latitude), lng: parseFloat(vendor.longitude) }
      : undefined
  );

  useEffect(() => {
    form.setFieldsValue({
      businessName: vendor.businessName,
      description: vendor.description,
      address: vendor.address,
      taxCode: vendor.taxCode,
      bankName: vendor.bankName,
      bankAccountNumber: vendor.bankAccountNumber,
      bankAccountName: vendor.bankAccountName,
    });
  }, [vendor, form]);

  const handleLocationChange = (newLocation: { lat: number; lng: number }) => {
    setLocation(newLocation);
  };

  const handleAvatarUpload = async (file: File) => {
    setUploading(true);
    try {
      const { validateImageFile, uploadImageToCloudinary } = await import('@/utils/cloudinary');
      const validationError = validateImageFile(file);
      if (validationError) throw new Error(validationError);

      const avatarUrl = await uploadImageToCloudinary(file);
      if (!avatarUrl) throw new Error('Upload thất bại');

      const updated = await VendorService.updateVendorProfile({
        ...vendor,
        avatarUrl,
      });
      message.success('Cập nhật ảnh đại diện thành công!');
      onSaved?.(updated);
    } catch (error: any) {
      message.error(error?.message || 'Không thể tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload: Partial<VendorProfile> = {
        ...vendor,
        ...values,
        latitude: location?.lat.toString(),
        longitude: location?.lng.toString(),
      };

      const response = await VendorService.updateVendorProfile(payload);

      // Merge current state with updates to ensure UI consistency
      const updatedVendor = {
        ...vendor,
        ...values,
        latitude: payload.latitude,
        longitude: payload.longitude,
        ...(response?.id ? response : {}),
      };

      message.success('Cập nhật thông tin kinh doanh thành công!');
      onSaved?.(updatedVendor);
    } catch (error: any) {
      message.error(error?.message || 'Không thể cập nhật thông tin kinh doanh');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue({
      businessName: vendor.businessName,
      description: vendor.description,
      address: vendor.address,
      taxCode: vendor.taxCode,
      bankName: vendor.bankName,
      bankAccountNumber: vendor.bankAccountNumber,
      bankAccountName: vendor.bankAccountName,
    });
    setLocation(
      vendor.latitude && vendor.longitude
        ? { lat: parseFloat(vendor.latitude), lng: parseFloat(vendor.longitude) }
        : undefined
    );
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
    >
      {/* Left Column: Business Info */}
      <div className="lg:col-span-7 space-y-6">
        {/* Profile Header Card */}
        <Card className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-5">
                <ProfileAvatar
                  src={vendor.avatarUrl}
                  alt={vendor.businessName}
                  size="lg"
                  onUpload={handleAvatarUpload}
                  loading={uploading}
                />
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Hồ sơ kinh doanh</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Cập nhật ảnh và thông tin doanh nghiệp
                  </p>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full font-medium inline-flex items-center gap-1.5 self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Đã xác minh
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tên doanh nghiệp</span>}
                  name="businessName"
                  rules={[{ required: true, message: 'Vui lòng nhập tên doanh nghiệp' }]}
                >
                  <Input className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors" />
                </Form.Item>

                <Form.Item
                  label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Danh mục đăng ký</span>}
                >
                  <Input
                    disabled
                    value="Du lịch sinh thái & Workshop văn hoá"
                    className="w-full px-4 py-2.5 border-none bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 cursor-not-allowed italic font-medium rounded-xl"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mô tả</span>}
                name="description"
              >
                <TextArea
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Địa chỉ kinh doanh</span>}
                name="address"
              >
                <Input
                  prefix={<MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-1" />}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors"
                  placeholder="Nhập địa chỉ kinh doanh..."
                />
              </Form.Item>

              <div className="pt-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
                  Vị trí trên bản đồ
                </span>
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <MapPicker value={location} onChange={handleLocationChange} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Banking info & Sidebar */}
      <div className="lg:col-span-5 space-y-6">
        {/* Banking Card */}
        <Card className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Thông tin ngân hàng</CardTitle>
                <CardDescription>Thông tin tài khoản nhận thanh toán</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form.Item
              label={<span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Mã số thuế</span>}
              name="taxCode"
            >
              <Input className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors" />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tên ngân hàng</span>}
              name="bankName"
            >
              <Input className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors" />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Số tài khoản</span>}
              name="bankAccountNumber"
            >
              <Input className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors font-mono" />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tên chủ tài khoản</span>}
              name="bankAccountName"
            >
              <Input className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors uppercase" />
            </Form.Item>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Đang lưu...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Lưu tất cả thông tin
                  </span>
                )}
              </Button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center gap-2 py-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Huỷ thay đổi
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Tip Banner — per guideline §10 */}
        <div className="flex items-start gap-3 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 px-4 py-3">
          <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">Lưu ý bảo mật</p>
            <p className="text-sm text-blue-600/80 dark:text-blue-400/60 leading-relaxed">
              Đảm bảo thông tin ngân hàng khớp với giấy tờ đăng ký chính thức để tránh chậm trễ thanh toán.
            </p>
          </div>
        </div>
      </div>
    </Form>
  );
}
