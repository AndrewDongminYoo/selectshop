package com.sparta.selectshop.controller;

import com.sparta.selectshop.dto.ProductMypriceRequestDto;
import com.sparta.selectshop.dto.ProductRequestDto;
import com.sparta.selectshop.models.Product;
import com.sparta.selectshop.security.UserDetailsImpl;
import com.sparta.selectshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController // JSON으로 데이터를 주고받음을 선언합니다.
public class ProductController {
    // 멤버 변수 선언
    private final ProductService productService;

    // 생성자: ProductController() 가 생성될 때 호출됨
    @Autowired
    public ProductController(ProductService productService) {
        // 멤버 변수 생성
        this.productService = productService;
    }

    // 로그인한 회원이 등록한 상품들 조회
    @GetMapping("/api/products")
    public Page<Product> getProducts(
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam("sortBy") String sortBy,
            @RequestParam("isAsc") boolean isAsc,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        Long userId = userDetails.getUser().getId();
        page = page - 1;
        return productService.getProducts(userId, page , size, sortBy, isAsc);
    }

    // 신규 상품 등록
    @PostMapping("/api/products")
    public Product createProduct(@RequestBody ProductRequestDto requestDto, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        // 로그인 되어 있는 ID
        Long userId = userDetails.getUser().getId();

        // 응답 보내기
        return productService.createProduct(requestDto, userId);
    }

    // 설정 가격 변경
    @PutMapping("/api/products/{id}")
    public Long updateProduct(@PathVariable Long id, @RequestBody ProductMypriceRequestDto requestDto) {
        Product product = productService.updateProduct(id, requestDto);
        // 응답 보내기
        return product.getId();
    }

    // (관리자용) 등록된 모든 상품 목록 조회
    @Secured("ROLE_ADMIN")
    @GetMapping("/api/admin/products")
    public Page<Product> getAllProducts(
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam("sortBy") String sortBy,
            @RequestParam("isAsc") boolean isAsc
    ) {
        return productService.getAllProducts(page , size, sortBy, isAsc);
    }
}