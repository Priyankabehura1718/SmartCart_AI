from django.shortcuts import render
from rest_framework import generics, permissions, pagination, viewsets
from . import models, serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


# Vendors
class VendorList(generics.ListAPIView):
    queryset = models.Vendor.objects.all()
    serializer_class = serializers.VendorSerializers


class VendorDetail(generics.RetrieveAPIView):
    queryset = models.Vendor.objects.all()
    serializer_class = serializers.VendorDetailSerializers


# Products
class ProductsList(generics.ListCreateAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductsSerializers
    pagination_class = pagination.LimitOffsetPagination
    permission_classes = [permissions.IsAuthenticated]


class ProductDetail(generics.RetrieveAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductDetailSerializers
    permission_classes = [permissions.IsAuthenticated]


# Customer
class CustomerList(generics.ListAPIView):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.VendorSerializers
    permission_classes = [permissions.IsAuthenticated]


class CustomerDetail(generics.RetrieveAPIView):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.VendorDetailSerializers
    permission_classes = [permissions.IsAuthenticated]


# Order
class OrderList(generics.ListAPIView):
    queryset = models.Order.objects.all()
    serializer_class = serializers.OrderSerializers
    permission_classes = [permissions.IsAuthenticated]


class OrderDetail(generics.RetrieveAPIView):
    serializer_class = serializers.OrderDetailSerializers

    def get_queryset(self):
        order_id = self.kwargs['pk']
        order = models.Order.objects.get(id=order_id)
        return models.OrderItems.objects.filter(order=order)


# Address
class AddressViewSet(viewsets.ModelViewSet):
    queryset = models.Address.objects.all()
    serializer_class = serializers.AddressSerializers
    permission_classes = [permissions.IsAuthenticated]


# Product Rating
class ProductRatingViewSet(viewsets.ModelViewSet):
    queryset = models.ProductRating.objects.all()
    serializer_class = serializers.ProductRatingSerializers
    permission_classes = [permissions.IsAuthenticated]


# =========================
# AUTH APIs (IMPORTANT)
# =========================

# SIGNUP
@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)


# LOGIN
@api_view(['POST'])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        login(request, user)
        return Response({"message": "Login successful"})
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


# LOGOUT
@api_view(['POST'])
def user_logout(request):
    logout(request)
    return Response({"message": "Logged out successfully"})