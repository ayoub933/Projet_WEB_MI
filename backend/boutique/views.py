from django.shortcuts import render

# Create your views here.

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Produit
from .serializers import ProduitSerializer

@api_view(['GET'])
def liste_produits(request):
    produits = Produit.objects.all()
    serializer = ProduitSerializer(produits, many=True)
    return Response(serializer.data)
