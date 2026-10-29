import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radius, shadows, spacing } from '../theme';
import { CITY_NAMES, getLocalitiesByCity } from '../data/localities';

// ─── Constants ────────────────────────────────────────────────────────────────
const BUILDING_TYPES = ['Residential', 'Commercial'];
const LISTING_TYPES = ['Sell', 'Rent', 'Lease', 'PG'];
const USER_TYPES = ['Owner', 'Broker'];
const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot', 'Independent House'];
const PROPERTY_STATUS = ['Ready to Move', 'Under Construction'];
const PLOT_TYPES = ['Independent Plot', 'Layout', 'Gated Community'];
const PLOT_SIZES = ['30×40', '30×50', '30×60', '60×90', 'Other'];
const DIRECTIONS = ['East', 'West', 'North', 'South'];
const BEDROOMS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK'];
const BATHROOMS = ['1', '2', '3', '4', '5'];
const BALCONIES = ['0', '1', '2', '3', '4', '5'];
const FURNISHING = ['Semi Furnished', 'Furnished', 'Unfurnished'];
const AMENITIES_LIST = ['Lift', 'Parking', 'Swimming Pool', 'Gym', 'Power Backup', 'Security', 'Club House', 'Garden', 'Play Area', 'Intercom', 'CCTV', 'Water Supply'];
const DIM_UNITS = ['Sq. Feet', 'Super Built Up Area', 'Built Up Area', 'Carpet Area'];

const STEPS = [
  { num: 1, title: 'Basic Details', icon: 'home-outline' },
  { num: 2, title: 'Property Details', icon: 'floor-plan' },
  { num: 3, title: 'Price & Details', icon: 'currency-inr' },
  { num: 4, title: 'Photos & Video', icon: 'camera-outline' },
  { num: 5, title: 'Details Info', icon: 'check-circle-outline' },
];

// ─── Reusable form components ─────────────────────────────────────────────────

/** Section label */
function Label({ text, required }) {
  return (
    <Text style={styles.label}>
      {text}
      {required && <Text style={{ color: '#e53935' }}> *</Text>}
    </Text>
  );
}

/** Single-select pill row (Radio-style) */
function RadioGroup({ options, value, onChange }) {
  return (
    <View style={styles.pillRow}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.pill, active && styles.pillActive]}
            onPress={() => onChange(opt)}
            activeOpacity={0.75}
          >
            <Text style={[styles.pillText, active && styles.pillTextActive]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/** Multi-select pill (checkbox-style) */
function CheckGroup({ options, value = [], onChange }) {
  function toggle(opt) {
    const next = value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt];
    onChange(next);
  }
  return (
    <View style={styles.pillRow}>
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.pill, active && styles.pillActive]}
            onPress={() => toggle(opt)}
            activeOpacity={0.75}
          >
            {active && <MaterialCommunityIcons name="check" size={12} color="#fff" />}
            <Text style={[styles.pillText, active && styles.pillTextActive]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/** Styled TextInput */
function FormInput({ placeholder, value, onChangeText, keyboardType = 'default', multiline, numberOfLines }) {
  return (
    <TextInput
      style={[styles.input, multiline && { height: numberOfLines * 22, textAlignVertical: 'top' }]}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      autoCorrect={false}
    />
  );
}

/** Simple dropdown trigger (opens a modal sheet) */
function SelectField({ label: placeholder, value, onPress }) {
  const hasValue = !!value;
  return (
    <TouchableOpacity style={styles.selectField} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.selectText, !hasValue && styles.selectPlaceholder]}>
        {value || placeholder}
      </Text>
      <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

/** Bottom-sheet option picker modal */
function PickerModal({
  visible,
  title,
  options,
  onSelect,
  onClose,
  searchable,
  searchPlaceholder,
  onSearch,
  allowCustom,
}) {
  const [q, setQ] = useState('');
  const [items, setItems] = useState(options || []);
  const debounce = useRef(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!visible) {
      setQ('');
      return;
    }

    if (!searchable) {
      setItems(options || []);
      return;
    }

    if (onSearch) {
      clearTimeout(debounce.current);
      if (!q.trim()) {
        setItems([]);
        return;
      }
      debounce.current = setTimeout(async () => {
        const res = await onSearch(q);
        setItems(res || []);
      }, 300);
      return () => clearTimeout(debounce.current);
    } else {
      if (!q.trim()) {
        setItems(options || []);
      } else {
        const query = q.trim().toLowerCase();
        setItems((options || []).filter((opt) => opt.toLowerCase().includes(query)));
      }
    }
  }, [q, options, onSearch, searchable, visible]);

  const handleClose = () => {
    setQ('');
    onClose();
  };

  const handleSelect = (item) => {
    onSelect(item);
    handleClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{title}</Text>
          <TouchableOpacity onPress={handleClose} hitSlop={8}>
            <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        {searchable && (
          <View style={styles.searchRow}>
            <MaterialCommunityIcons name="magnify" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder || 'Search…'}
              placeholderTextColor={colors.textMuted}
              value={q}
              onChangeText={setQ}
              autoFocus
            />
            {q.length > 0 && (
              <TouchableOpacity onPress={() => setQ('')} hitSlop={8}>
                <MaterialCommunityIcons name="close-circle" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        )}
        <FlatList
          data={items}
          keyExtractor={(item) => item}
          style={{ maxHeight: 320 }}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            allowCustom && q.trim().length > 0 && !items.some((i) => i.toLowerCase() === q.trim().toLowerCase()) ? (
              <TouchableOpacity
                style={[
                  styles.pickerItem,
                  { backgroundColor: colors.surfaceAlt || '#f0f4ff', borderRadius: 8, marginBottom: 4 },
                ]}
                onPress={() => handleSelect(q.trim())}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="plus-circle-outline" size={16} color={colors.primary} />
                <Text style={[styles.pickerItemText, { color: colors.primary, fontWeight: '600' }]}>
                  Use "{q.trim()}"
                </Text>
              </TouchableOpacity>
            ) : null
          }
          ListEmptyComponent={
            <Text style={styles.emptyPicker}>
              {searchable && onSearch && !q.trim()
                ? 'Type to search…'
                : searchable && q.trim()
                ? 'No matching results found'
                : 'No options available'}
            </Text>
          }
          ItemSeparatorComponent={() => <View style={styles.pickerDivider} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.pickerItem}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              {searchable && <MaterialCommunityIcons name="map-marker-outline" size={16} color={colors.primary} />}
              <Text style={styles.pickerItemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

// ─── STEP 1: Basic Details ────────────────────────────────────────────────────
function Step1({ data, update }) {
  const [cityModal, setCityModal] = useState(false);
  const [localityModal, setLocalityModal] = useState(false);

  const cityLocalities = getLocalitiesByCity(data.city);

  return (
    <View style={styles.stepContent}>
      <Label text="Building Type" required />
      <RadioGroup options={BUILDING_TYPES} value={data.buildingType} onChange={update('buildingType')} />

      <Label text="Would you like to?" required />
      <RadioGroup
        options={LISTING_TYPES}
        value={data.listingType}
        onChange={(val) => {
          update('listingType')(val);
          if (val !== 'Sell') {
            update('propertyStatus')('');
          }
        }}
      />

      <Label text="Are you a?" required />
      <RadioGroup options={USER_TYPES} value={data.userType} onChange={update('userType')} />

      <Label text="Email" required />
      <FormInput placeholder="Enter your email" value={data.email} onChangeText={update('email')} keyboardType="email-address" />

      <Label text="Property Type" required />
      <RadioGroup
        options={PROPERTY_TYPES}
        value={data.propertyType}
        onChange={(val) => {
          update('propertyType')(val);
          if (val === 'Plot') {
            update('propertyAge')('');
            update('bedroom')('');
            update('bathroom')('');
            update('balconies')('');
            update('doorFacing')('');
            update('furnishingStatus')('');
            update('amenities')([]);
            update('totalFloors')('');
            update('selectedFloor')('');
          } else {
            update('plotType')('');
            update('plotSize')('');
            update('customPlotSize')('');
            update('roadFacing')('');
            update('plotAge')('');
            update('plotDimension')('');
            update('plotDimensionUnit')('');
          }
        }}
      />

      {data.propertyType !== 'Plot' && (
        <>
          <Label text="Property Age" required />
          <FormInput placeholder="e.g. 3" value={data.propertyAge} onChangeText={update('propertyAge')} keyboardType="numeric" />
        </>
      )}

      {data.listingType === 'Sell' && (
        <>
          <Label text="Property Status" required />
          <RadioGroup options={PROPERTY_STATUS} value={data.propertyStatus} onChange={update('propertyStatus')} />
        </>
      )}

      <Label text="City" required />
      <SelectField label="Select City" value={data.city} onPress={() => setCityModal(true)} />
      <PickerModal
        visible={cityModal}
        title="Select City"
        options={CITY_NAMES}
        searchable
        searchPlaceholder="Search city (e.g. Chennai, Bangalore)…"
        onSelect={(city) => {
          update('city')(city);
          if (city !== data.city) {
            update('locality')('');
          }
        }}
        onClose={() => setCityModal(false)}
      />

      <Label text="Locality" required />
      {!data.city ? (
        <SelectField
          label="Select City first"
          value=""
          onPress={() => Alert.alert('Select City', 'Please select a city first to view its localities.')}
        />
      ) : (
        <>
          <SelectField
            label={`Select Locality in ${data.city}`}
            value={data.locality}
            onPress={() => setLocalityModal(true)}
          />
          <PickerModal
            visible={localityModal}
            title={`Localities in ${data.city}`}
            options={cityLocalities}
            searchable
            allowCustom
            searchPlaceholder={`Search localities in ${data.city}…`}
            onSelect={update('locality')}
            onClose={() => setLocalityModal(false)}
          />
        </>
      )}

      <Label text="Property Name" required />
      <FormInput placeholder="e.g. Prestige Silver Crest" value={data.propertyName} onChangeText={update('propertyName')} />

      <Label text="Address" required />
      <FormInput placeholder="Full address" value={data.address} onChangeText={update('address')} multiline numberOfLines={3} />

      <Label text="Postal Code" required />
      <FormInput placeholder="6-digit PIN" value={data.postalCode} onChangeText={update('postalCode')} keyboardType="numeric" />
    </View>
  );
}

function isStep1Valid(d) {
  const isStatusValid = d.listingType === 'Sell' ? !!d.propertyStatus : true;
  const isAgeValid = d.propertyType === 'Plot' ? true : !!d.propertyAge;
  return !!(d.buildingType && d.listingType && d.userType && d.email &&
    d.propertyType && isAgeValid && isStatusValid &&
    d.city && d.locality && d.propertyName && d.address && d.postalCode);
}

// ─── STEP 2: Property Details ─────────────────────────────────────────────────
function Step2({ data, update }) {
  const [plotTypeModal, setPlotTypeModal] = useState(false);
  const [plotSizeModal, setPlotSizeModal] = useState(false);
  const [dimUnitModal, setDimUnitModal] = useState(false);
  const [amenityModal, setAmenityModal] = useState(false);

  const isPlot = data.propertyType === 'Plot';

  return (
    <View style={styles.stepContent}>
      {isPlot ? (
        <>
          <Label text="Plot Type" required />
          <SelectField label="Select Plot Type" value={data.plotType} onPress={() => setPlotTypeModal(true)} />
          <PickerModal visible={plotTypeModal} title="Plot Type" options={PLOT_TYPES}
            onSelect={update('plotType')} onClose={() => setPlotTypeModal(false)} />

          <Label text="Plot Size" required />
          <SelectField label="Select Plot Size" value={data.plotSize} onPress={() => setPlotSizeModal(true)} />
          <PickerModal
            visible={plotSizeModal}
            title="Plot Size"
            options={PLOT_SIZES}
            onSelect={(val) => {
              update('plotSize')(val);
              if (val !== 'Other') {
                update('customPlotSize')('');
              }
            }}
            onClose={() => setPlotSizeModal(false)}
          />

          {data.plotSize === 'Other' && (
            <View style={{ marginTop: 8 }}>
              <FormInput
                placeholder="Enter custom plot size (e.g. 40×60)"
                value={data.customPlotSize}
                onChangeText={update('customPlotSize')}
              />
            </View>
          )}

          <Label text="Road Facing" required />
          <RadioGroup options={DIRECTIONS} value={data.roadFacing} onChange={update('roadFacing')} />

          <Label text="Plot Age" required />
          <FormInput placeholder="e.g. 2" value={data.plotAge} onChangeText={update('plotAge')} keyboardType="numeric" />

          <Label text="Plot Dimension" required />
          <View style={styles.rowInputs}>
            <View style={{ flex: 1 }}>
              <FormInput placeholder="Enter dimension" value={data.plotDimension}
                onChangeText={update('plotDimension')} keyboardType="numeric" />
            </View>
            <TouchableOpacity style={styles.unitBtn} onPress={() => setDimUnitModal(true)} activeOpacity={0.8}>
              <Text style={styles.unitBtnText} numberOfLines={1}>{data.plotDimensionUnit || 'Unit'}</Text>
              <MaterialCommunityIcons name="chevron-down" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          <PickerModal visible={dimUnitModal} title="Select Unit" options={DIM_UNITS}
            onSelect={update('plotDimensionUnit')} onClose={() => setDimUnitModal(false)} />
        </>
      ) : (
        <>
          <Label text="Bedroom" required />
          <RadioGroup options={BEDROOMS} value={data.bedroom} onChange={update('bedroom')} />

          <Label text="Bathroom" required />
          <RadioGroup options={BATHROOMS} value={data.bathroom} onChange={update('bathroom')} />

          <Label text="Balconies" required />
          <RadioGroup options={BALCONIES} value={data.balconies} onChange={update('balconies')} />

          <Label text="Door Facing" required />
          <RadioGroup options={DIRECTIONS} value={data.doorFacing} onChange={update('doorFacing')} />

          <Label text="Furnishing Status" required />
          <RadioGroup options={FURNISHING} value={data.furnishingStatus} onChange={update('furnishingStatus')} />

          {/* Amenities */}
          <TouchableOpacity style={styles.amenityBtn} onPress={() => setAmenityModal(true)} activeOpacity={0.85}>
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.amenityBtnText}>
              Add Amenities{data.amenities?.length ? ` (${data.amenities.length} selected)` : ''}
            </Text>
          </TouchableOpacity>

          {/* Amenity multi-select modal */}
          <Modal visible={amenityModal} transparent animationType="slide" onRequestClose={() => setAmenityModal(false)} statusBarTranslucent>
            <Pressable style={styles.backdrop} onPress={() => setAmenityModal(false)} />
            <View style={[styles.sheet, { paddingBottom: 24 }]}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Add Amenities</Text>
                <TouchableOpacity onPress={() => setAmenityModal(false)} hitSlop={8}>
                  <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <CheckGroup options={AMENITIES_LIST} value={data.amenities} onChange={update('amenities')} />
              </ScrollView>
              <TouchableOpacity style={styles.applyBtn} onPress={() => setAmenityModal(false)} activeOpacity={0.85}>
                <Text style={styles.applyBtnText}>
                  Apply{data.amenities?.length ? ` (${data.amenities.length})` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

function isStep2Valid(d) {
  if (d.propertyType === 'Plot') {
    const isSizeValid = d.plotSize === 'Other' ? !!d.customPlotSize : !!d.plotSize;
    return !!(d.plotType && isSizeValid && d.roadFacing && d.plotAge &&
      d.plotDimension && d.plotDimensionUnit);
  }
  return !!(d.bedroom && d.bathroom && d.balconies && d.doorFacing && d.furnishingStatus);
}

// ─── STEP 3: Price & Details ──────────────────────────────────────────────────
function Step3({ data, update }) {
  return (
    <View style={styles.stepContent}>
      {data.propertyType !== 'Plot' && (
        <>
          <Label text="Total Floors" required />
          <FormInput placeholder="e.g. 5" value={data.totalFloors} onChangeText={update('totalFloors')} keyboardType="numeric" />

          <Label text="Your Floor (Select Floor)" required />
          <FormInput placeholder="e.g. 3" value={data.selectedFloor} onChangeText={update('selectedFloor')} keyboardType="numeric" />
        </>
      )}

      <Label text="Price (₹)" required />
      <FormInput placeholder="e.g. 5000000" value={data.price} onChangeText={update('price')} keyboardType="numeric" />

      <Label text="Maintenance Charge (₹ / month)" required />
      <FormInput placeholder="e.g. 2000" value={data.maintenanceCharge} onChangeText={update('maintenanceCharge')} keyboardType="numeric" />

      <Label text="About Your Property" required />
      <FormInput
        placeholder="Describe your property…"
        value={data.description}
        onChangeText={update('description')}
        multiline
        numberOfLines={5}
      />
    </View>
  );
}

function isStep3Valid(d) {
  const areFloorsValid = d.propertyType === 'Plot' ? true : !!(d.totalFloors && d.selectedFloor);
  return !!(areFloorsValid && d.price && d.maintenanceCharge && d.description);
}

// ─── STEP 4: Photos & Video ───────────────────────────────────────────────────
const PHOTO_SLOTS = 6;

function Step4({ data, update }) {
  const images = data.images || [];

  function addPlaceholder() {
    if (images.length >= PHOTO_SLOTS) return;
    // Placeholder — replace with expo-image-picker in production
    const next = [...images, `https://picsum.photos/seed/prop${images.length + 1}/400/300`];
    update('images')(next);
  }

  function removeImage(idx) {
    const next = images.filter((_, i) => i !== idx);
    update('images')(next);
  }

  return (
    <View style={styles.stepContent}>
      <Text style={styles.photoHint}>
        Add up to {PHOTO_SLOTS} photos. First photo will be the cover image.
      </Text>

      <View style={styles.photoGrid}>
        {/* Existing images */}
        {images.map((uri, idx) => (
          <View key={idx} style={styles.photoSlot}>
            <MaterialCommunityIcons name="image" size={36} color={colors.primary} />
            <Text style={styles.photoLabel}>Photo {idx + 1}{idx === 0 ? ' (Cover)' : ''}</Text>
            <TouchableOpacity style={styles.photoRemove} onPress={() => removeImage(idx)}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#e53935" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add slot */}
        {images.length < PHOTO_SLOTS && (
          <TouchableOpacity style={[styles.photoSlot, styles.photoAdd]} onPress={addPlaceholder} activeOpacity={0.8}>
            <MaterialCommunityIcons name="camera-plus-outline" size={32} color={colors.primary} />
            <Text style={styles.photoAddText}>Add Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      {images.length === 0 && (
        <Text style={styles.photoRequired}>⚠ Please add at least 1 photo to continue.</Text>
      )}
    </View>
  );
}

function isStep4Valid(d) {
  return (d.images || []).length > 0;
}

// ─── STEP 5: Details Info (Review) ───────────────────────────────────────────
function ReviewRow({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{Array.isArray(value) ? value.join(', ') || '—' : value || '—'}</Text>
    </View>
  );
}

function ReviewSection({ title, children }) {
  return (
    <View style={styles.reviewSection}>
      <Text style={styles.reviewSectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Step5({ data }) {
  return (
    <View style={styles.stepContent}>
      <ReviewSection title="📋 Basic Details">
        <ReviewRow label="Building Type" value={data.buildingType} />
        <ReviewRow label="Listing Type" value={data.listingType} />
        <ReviewRow label="You Are" value={data.userType} />
        <ReviewRow label="Email" value={data.email} />
        <ReviewRow label="Property Type" value={data.propertyType} />
        {data.propertyType !== 'Plot' && (
          <ReviewRow label="Property Age" value={data.propertyAge ? `${data.propertyAge} yrs` : ''} />
        )}
        {data.listingType === 'Sell' && <ReviewRow label="Property Status" value={data.propertyStatus} />}
        <ReviewRow label="City" value={data.city} />
        <ReviewRow label="Locality" value={data.locality} />
        <ReviewRow label="Property Name" value={data.propertyName} />
        <ReviewRow label="Address" value={data.address} />
        <ReviewRow label="Postal Code" value={data.postalCode} />
      </ReviewSection>

      <ReviewSection title="🏗 Property Details">
        {data.propertyType === 'Plot' ? (
          <>
            <ReviewRow label="Plot Type" value={data.plotType} />
            <ReviewRow
              label="Plot Size"
              value={data.plotSize === 'Other' && data.customPlotSize ? `${data.customPlotSize} (Other)` : data.plotSize}
            />
            <ReviewRow label="Road Facing" value={data.roadFacing} />
            <ReviewRow label="Plot Age" value={data.plotAge ? `${data.plotAge} yrs` : ''} />
            <ReviewRow label="Dimension" value={data.plotDimension ? `${data.plotDimension} ${data.plotDimensionUnit}` : ''} />
          </>
        ) : (
          <>
            <ReviewRow label="Bedroom" value={data.bedroom} />
            <ReviewRow label="Bathroom" value={data.bathroom} />
            <ReviewRow label="Balconies" value={data.balconies} />
            <ReviewRow label="Door Facing" value={data.doorFacing} />
            <ReviewRow label="Furnishing" value={data.furnishingStatus} />
            <ReviewRow label="Amenities" value={data.amenities} />
          </>
        )}
      </ReviewSection>

      <ReviewSection title="💰 Price & Details">
        {data.propertyType !== 'Plot' && (
          <>
            <ReviewRow label="Total Floors" value={data.totalFloors} />
            <ReviewRow label="Your Floor" value={data.selectedFloor} />
          </>
        )}
        <ReviewRow label="Price" value={data.price ? `₹ ${Number(data.price).toLocaleString('en-IN')}` : ''} />
        <ReviewRow label="Maintenance" value={data.maintenanceCharge ? `₹ ${data.maintenanceCharge}/mo` : ''} />
        <ReviewRow label="Description" value={data.description} />
      </ReviewSection>

      <ReviewSection title="📸 Photos">
        <ReviewRow label="Photos Added" value={`${(data.images || []).length} photo(s)`} />
      </ReviewSection>
    </View>
  );
}

// ─── Main ListingFormScreen ───────────────────────────────────────────────────
const INITIAL_DATA = {
  // Step 1
  buildingType: '', listingType: '', userType: '', email: '',
  propertyType: '', propertyAge: '', propertyStatus: '',
  city: '', locality: '', propertyName: '', address: '', postalCode: '',
  // Step 2
  plotType: '', plotSize: '', customPlotSize: '', roadFacing: '', plotAge: '',
  plotDimension: '', plotDimensionUnit: '', bedroom: '',
  bathroom: '', balconies: '', doorFacing: '', furnishingStatus: '',
  amenities: [],
  // Step 3
  totalFloors: '', selectedFloor: '', price: '',
  maintenanceCharge: '', description: '',
  // Step 4
  images: [],
};

const VALIDATORS = [isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid, () => true];

export default function ListingFormScreen({ onBack }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const scrollRef = useRef(null);

  const update = (key) => (val) => setFormData((prev) => ({ ...prev, [key]: val }));

  const canProceed = VALIDATORS[step - 1]?.(formData) ?? false;

  function goNext() {
    if (step < 5) {
      setStep(step + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }

  function goBack() {
    if (step > 1) {
      setStep(step - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      onBack?.();
    }
  }

  function handleSubmit() {
    console.log('[ListingForm] Submit:', formData);
    Alert.alert('🎉 Property Listed!', 'Your property has been submitted successfully. Our team will review it shortly.', [
      { text: 'OK', onPress: onBack },
    ]);
  }

  const progress = step / 5;
  const currentStepInfo = STEPS[step - 1];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Top header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={8} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{currentStepInfo.title}</Text>
          <Text style={styles.headerSub}>Step {step} of 5</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* ── Progress bar ── */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* ── Step pills ── */}
      <View style={styles.stepPills}>
        {STEPS.map((s) => (
          <View key={s.num} style={[styles.stepPill, step >= s.num && styles.stepPillActive]}>
            <MaterialCommunityIcons
              name={step > s.num ? 'check' : s.icon}
              size={14}
              color={step >= s.num ? '#fff' : colors.textMuted}
            />
          </View>
        ))}
      </View>

      {/* ── Form content ── */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 && <Step1 data={formData} update={update} />}
          {step === 2 && <Step2 data={formData} update={update} />}
          {step === 3 && <Step3 data={formData} update={update} />}
          {step === 4 && <Step4 data={formData} update={update} />}
          {step === 5 && <Step5 data={formData} />}

          {/* ── Next / Submit button ── */}
          {canProceed && (
            <TouchableOpacity
              style={styles.nextBtn}
              activeOpacity={0.85}
              onPress={step === 5 ? handleSubmit : goNext}
            >
              <Text style={styles.nextBtnText}>
                {step === 5 ? 'Submit Listing' : 'Next'}
              </Text>
              <MaterialCommunityIcons
                name={step === 5 ? 'check-circle-outline' : 'arrow-right'}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          )}

          {!canProceed && (
            <View style={styles.nextBtnDisabled}>
              <Text style={styles.nextBtnDisabledText}>Fill all fields to continue</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.07)',
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontFamily: fonts.manrope.bold, fontSize: 17, color: colors.textPrimary },
  headerSub: { fontFamily: fonts.inter.medium, fontSize: 11, color: colors.textSecondary, marginTop: 1 },

  /* Progress */
  progressTrack: { height: 3, backgroundColor: 'rgba(0,0,0,0.08)' },
  progressFill: { height: 3, backgroundColor: colors.primary, borderRadius: 2 },

  /* Step pills */
  stepPills: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  stepPill: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  stepPillActive: { backgroundColor: colors.primary },

  /* Scroll */
  scroll: { paddingHorizontal: spacing.screen, paddingTop: 8, paddingBottom: 100 },
  stepContent: { gap: 14 },

  /* Label */
  label: {
    fontFamily: fonts.inter.semibold,
    fontSize: 13,
    color: colors.textPrimary,
    marginTop: 8,
  },

  /* Radio pills */
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: '#fff',
  },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { fontFamily: fonts.inter.medium, fontSize: 13, color: colors.textSecondary },
  pillTextActive: { color: '#fff', fontFamily: fonts.inter.bold },

  /* Input */
  input: {
    backgroundColor: '#fff',
    borderRadius: radius.sm,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.10)',
    paddingHorizontal: 14, paddingVertical: 13,
    fontFamily: fonts.inter.medium, fontSize: 14, color: colors.textPrimary,
    ...shadows.soft,
  },

  /* Select field */
  selectField: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: radius.sm,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.10)',
    paddingHorizontal: 14, paddingVertical: 14,
    ...shadows.soft,
  },
  selectText: { flex: 1, fontFamily: fonts.inter.medium, fontSize: 14, color: colors.textPrimary },
  selectPlaceholder: { color: colors.textMuted },

  /* Row inputs (dimension + unit) */
  rowInputs: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  unitBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#fff', borderRadius: radius.sm,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.10)',
    paddingHorizontal: 10, paddingVertical: 14,
    width: 130, ...shadows.soft,
  },
  unitBtnText: { flex: 1, fontFamily: fonts.inter.medium, fontSize: 12, color: colors.textPrimary },

  /* Amenity button */
  amenityBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: `${colors.primary}12`,
    borderWidth: 1.5, borderColor: `${colors.primary}40`,
    borderStyle: 'dashed',
    borderRadius: radius.sm,
    paddingHorizontal: 16, paddingVertical: 14,
    marginTop: 4,
  },
  amenityBtnText: { fontFamily: fonts.inter.semibold, fontSize: 14, color: colors.primary },

  /* Photos */
  photoHint: { fontFamily: fonts.inter.medium, fontSize: 12, color: colors.textSecondary },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoSlot: {
    width: '47%', aspectRatio: 4 / 3,
    borderRadius: radius.sm, backgroundColor: `${colors.primary}10`,
    borderWidth: 1.5, borderColor: `${colors.primary}30`,
    alignItems: 'center', justifyContent: 'center', gap: 6,
    position: 'relative',
  },
  photoAdd: { borderStyle: 'dashed' },
  photoLabel: { fontFamily: fonts.inter.medium, fontSize: 11, color: colors.primary, textAlign: 'center' },
  photoAddText: { fontFamily: fonts.inter.semibold, fontSize: 13, color: colors.primary },
  photoRemove: { position: 'absolute', top: 6, right: 6 },
  photoRequired: { fontFamily: fonts.inter.medium, fontSize: 12, color: '#e53935', marginTop: 4 },

  /* Review */
  reviewSection: {
    backgroundColor: '#fff', borderRadius: radius.md, overflow: 'hidden',
    marginBottom: 12, ...shadows.soft,
  },
  reviewSectionTitle: {
    fontFamily: fonts.manrope.bold, fontSize: 14, color: colors.textPrimary,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.07)',
    backgroundColor: colors.surfaceMuted,
  },
  reviewRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  reviewLabel: { fontFamily: fonts.inter.medium, fontSize: 13, color: colors.textMuted, flex: 1 },
  reviewValue: { fontFamily: fonts.inter.semibold, fontSize: 13, color: colors.textPrimary, flex: 1.5, textAlign: 'right' },

  /* Next / Submit button */
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: colors.primary, borderRadius: radius.sm,
    paddingVertical: 16, marginTop: 24, ...shadows.card,
  },
  nextBtnText: { fontFamily: fonts.manrope.bold, fontSize: 16, color: '#fff' },
  nextBtnDisabled: {
    borderRadius: radius.sm, paddingVertical: 16, marginTop: 24,
    backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center',
  },
  nextBtnDisabledText: { fontFamily: fonts.inter.medium, fontSize: 14, color: colors.textMuted },

  /* Picker modal */
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingTop: 12, paddingHorizontal: 20, maxHeight: '80%',
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0',
    alignSelf: 'center', marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  sheetTitle: { fontFamily: fonts.manrope.bold, fontSize: 17, color: colors.textPrimary },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.background, borderRadius: radius.sm,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10,
  },
  searchInput: { flex: 1, fontFamily: fonts.inter.medium, fontSize: 14, color: colors.textPrimary, padding: 0 },
  pickerItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 13, paddingHorizontal: 4,
  },
  pickerItemText: { fontFamily: fonts.inter.medium, fontSize: 14, color: colors.textPrimary },
  pickerDivider: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(0,0,0,0.06)' },
  emptyPicker: { textAlign: 'center', fontFamily: fonts.inter.medium, fontSize: 14, color: colors.textMuted, padding: 20 },
  applyBtn: {
    backgroundColor: colors.primary, borderRadius: radius.sm,
    paddingVertical: 14, alignItems: 'center', marginTop: 12,
  },
  applyBtnText: { fontFamily: fonts.manrope.bold, fontSize: 15, color: '#fff' },
});
